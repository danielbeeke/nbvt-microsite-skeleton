<?php

error_reporting(E_ALL);
ini_set('display_errors', TRUE);
ini_set('display_startup_errors', TRUE);

$cname = file_get_contents('CNAME');

if (file_exists('.environment')) {
    $nbvt_url = file_get_contents('.environment');
}
else {
    $nbvt_url = 'http://nbvt-microsites.dev.aegirhosting.nl';
}

$micro_site_info_url = $nbvt_url . '/api/v1/microsites' . '?' . 'microsite=' . $cname;

$micro_sites_info = json_decode(file_get_contents($micro_site_info_url), TRUE);

$micro_site_info = end($micro_sites_info['microsite']);

if (!file_exists('app/_data')) {
    mkdir('app/_data');
}

file_put_contents('app/_data/microsite.json', stripslashes(json_encode($micro_site_info)));

if (isset($micro_site_info['header_font']) && isset($micro_site_info['body_font'])) {
    $scss_contents = '$header-font: "' .  $micro_site_info['fonts']['header_font'] . '";' . "\n" .
        '$body-font: "' . $micro_site_info['fonts']['body_font'] . '";' . "\n" .
        '$primary: ' . $micro_site_info['primary_color'] . ';' . "\n" .
        '$secondary: ' . $micro_site_info['secondary_color'] . ';' . "\n" .
        '$tertiary: ' . $micro_site_info['tertiary_color'] . ';' . "\n" .
        '$background-color: ' . $micro_site_info['background_color'] . ';' . "\n" .
        '$text-color: ' . $micro_site_info['text_color'] . ';' . "\n";

    file_put_contents('app/_scss/variables/_imported.scss', $scss_contents);
}

foreach ($micro_site_info['components'] as $component) {

    $component_info_url = $nbvt_url . '/api/v1/' . $component . '?' . 'microsite=' . $cname;
    $component_data = file_get_contents($component_info_url);
    $component_info = json_decode($component_data, TRUE);

    echo 'Download json for component: ' . $component . "\n";
    echo $component_info_url . "\n\n";

    $first_item = array_shift($component_info);

    if (!is_string($first_item)) {
        $component_info = array_values($first_item);

        if (isset($component_info[0]['download'])) {
            if (!file_exists('app/_' . $component)) {
                mkdir('app/_' . $component);
            }
        }

        echo 'Checking: ' . 'app/_data/' . $component . '.json' . "\n";

        if (file_exists('app/_data/' . $component . '.json')) {
            unlink('app/_data/' . $component . '.json');
        }

        file_put_contents('app/_data/' . $component . '.json', stripslashes(json_encode($component_info)));

        $files = glob('app/_' . $component . '/*');
        if (isset($files) && count($files)) {
            foreach ($files as $file){
                if (is_file($file)) {
                    echo 'Unlinking old file: ' . $file . "\n";
                    unlink($file);
                }
            }
        }

        foreach ($component_info as $item_nid => $item_data) {
            if (isset($item_data['download'])) {
                $item_url = $nbvt_url . '/' . $item_data['download']  . '?' . 'microsite=' . $cname;
                $item = file_get_contents($item_url);
                $file_name = get_real_filename($http_response_header, $item_url);
                file_put_contents('app/_' . $component . '/' . $file_name, $item);
            }
        }
    }
}

// Creating the menu items json.
// Not to happy with this, this is more like a fix for something I don't know how to fix in jekyll.
$pages = scandir('app/_pages');
unset($pages[0]);
unset($pages[1]);

$menu_json = array();

foreach ($pages as $page_file_name) {
    $page = file_get_contents('app/_pages/' . $page_file_name);
    $page_exploded = explode('---', $page);
    $yaml = trim($page_exploded[1]);
    $front_matter = yaml_parse($yaml);
    $front_matter['file_name'] = $page_file_name;
    $front_matter['url'] = '/' . str_replace(array('.md', '.html'), '', $page_file_name) . '/';
    $menu_json[] = $front_matter;
}

file_put_contents('app/_data/menu.json', stripslashes(json_encode($menu_json)));

// Remove the overview pages that contain pagers.
$news_items_folder_items = scandir('app/_news');
$blog_items_folder_items = scandir('app/_blogs');

if (count($news_items_folder_items) > 2 && file_exists('app/_pages/nieuws.md')) {
    unlink('app/_pages/nieuws.md');
}

if (count($blog_items_folder_items) > 2 && file_exists('app/_pages/blogs.md')) {
    unlink('app/_pages/blogs.md');
}

function get_real_filename($headers, $url) {
    foreach($headers as $header) {
        if (strpos(strtolower($header),'content-disposition') !== false) {
            $tmp_name = explode('=', $header);
            if ($tmp_name[1]) return trim($tmp_name[1],'";\'');
        }
    }

    $stripped_url = preg_replace('/\\?.*/', '', $url);
    return basename($stripped_url);
}

$site_menu_sorted_keys = array();
foreach ($menu_json as $menu_item) {
    $site_menu_sorted_keys[$menu_item['menu_weight']] = $menu_item['url'];
}

ksort($site_menu_sorted_keys);
$frontpage_url = array_shift($site_menu_sorted_keys);

if (file_exists('vhost_skeleton') && !file_exists('vhost')) {
    print "No vhost file found. We're building one for you..."."\n";

    // Generate a vhost file from vhost_skeleton
    $vhost_skeleton = file_get_contents('vhost_skeleton');
    $new_vhost = $vhost_skeleton;
    $new_vhost = str_replace('[TIMESTAMP]', date("d-m-Y H:i:s"), $new_vhost);
    $new_vhost = str_replace('[CNAME]', $cname, $new_vhost);
    $new_vhost = str_replace('[NID]', $micro_site_info['nid'], $new_vhost);
    $new_vhost = str_replace('[FRONTPAGE]', $frontpage_url, $new_vhost);

    // Build the vhost file
    file_put_contents('vhost', $new_vhost);

    print "The vhost file has been created!"."\n";
}
else if (file_exists('vhost_skeleton') && file_exists('vhost')) {
    print "Vhost file found. Rebuilding with custom vhost rules..."."\n";

    // Get custom rules from the current vhost file
    $current_vhost = file_get_contents('vhost');
    $custom_vhost_rules_components = explode('# START OF CUSTOM VHOST RULES', $current_vhost);
    $custom_vhost_rules = $custom_vhost_rules_components[1];

    // Generate a new vhost file from vhost_skeleton and add the custom rules
    $vhost_skeleton = file_get_contents('vhost_skeleton');
    $new_vhost = $vhost_skeleton;
    $new_vhost = str_replace('[CNAME]', $cname, $new_vhost);
    $new_vhost = str_replace('[NID]', $micro_site_info['nid'], $new_vhost);
    $new_vhost = str_replace('[FRONTPAGE]', $frontpage_url, $new_vhost);
    $new_vhost = str_replace('# START OF CUSTOM VHOST RULES', '# START OF CUSTOM VHOST RULES'.$custom_vhost_rules, $new_vhost);

    // Build the vhost file
    file_put_contents('vhost', $new_vhost);

    print "We've rebuilded the vhost file!"."\n";
}
else {
    print 'The file vhost_skeleton was not found. This file has to be in the root.'."\n";
}