<?php

$cname = file_get_contents('CNAME');

$nbvt_url = 'http://nbvt.daniel';

$micro_site_info_url = $nbvt_url . '/api/v1/microsites' . '?' . 'microsite=' . $cname;
$micro_sites_info = json_decode(file_get_contents($micro_site_info_url), TRUE);
$micro_site_info = end($micro_sites_info['microsite']);

$page_type_mapping = array(
    'blogs' => array(
        'single' => 'blog',
        'folder' => '_blogs'
    ),
    'pages' => array(
        'single' => 'page',
        'folder' => '_pages'
    ),
    'news' => array(
        'single' => 'news_item',
        'folder' => '_news'
    )
);

if (!file_exists('app/_data')) {
    mkdir('app/_data');
}

file_put_contents('app/_data/microsite.json', stripslashes(json_encode($micro_site_info)));

if (isset($micro_site_info['header_font']) && isset($micro_site_info['body_font'])) {
    $header_font_exploded = explode(':', $micro_site_info['header_font']);
    $header_font = str_replace('+', ' ', $header_font_exploded[0]);

    $body_font_exploded = explode(':', $micro_site_info['body_font']);
    $body_font = str_replace('+', ' ', $body_font_exploded[0]);

    $scss_contents = '$header-font: "' . $header_font . '";' . "\n" .
        '$body-font: "' . $body_font . '";' . "\n" .
        '$primary: ' . $micro_site_info['primary_color'] . ';' . "\n" .
        '$secondary: ' . $micro_site_info['secondary_color'] . ';' . "\n" .
        '$tertiary: ' . $micro_site_info['tertiary_color'] . ';' . "\n" .
        '$background-color: ' . $micro_site_info['background_color'] . ';' . "\n" .
        '$text-color: ' . $micro_site_info['text_color'] . ';' . "\n";

    file_put_contents('app/_scss/variables/_imported.scss', $scss_contents);
}

foreach ($micro_site_info['components'] as $component) {
    $component_info_url = $nbvt_url . '/api/v1/' . $component . '?' . 'microsite=' . $cname;
    $component_info = json_decode(file_get_contents($component_info_url), TRUE);

    if (isset($page_type_mapping[$component]['folder']) && !file_exists('app/' . $page_type_mapping[$component]['folder'])) {
        mkdir('app/' . $page_type_mapping[$component]['folder']);
    }

    if (file_exists('app/_data/' . $component . '.json')) {
        unlink('app/_data/' . $component . '.json');
    }

    file_put_contents('app/_data/' . $component . '.json', stripslashes(json_encode($component_info)));

    if (in_array($component, array_keys($page_type_mapping))) {
        $files = glob('app/' . $page_type_mapping[$component]['folder'] . '/*');
        foreach ($files as $file){
            if (is_file($file) && substr($file, -3) == '.md') {
                unlink($file);
            }
        }

        foreach ($component_info[$page_type_mapping[$component]['single']] as $item_nid => $item_data) {
            if (isset($item_data['download'])) {
                $item_url = $nbvt_url . '/' . $item_data['download']  . '?' . 'microsite=' . $cname;
                $item = file_get_contents($item_url);
                $file_name = get_real_filename($http_response_header, $item_url);
                file_put_contents('app/' . $page_type_mapping[$component]['folder'] . '/' . $file_name, $item);
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
unlink('app/_pages/nieuws.md');
unlink('app/_pages/blogs.md');

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