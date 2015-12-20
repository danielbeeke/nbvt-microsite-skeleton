<?php

$cname = file_get_contents('CNAME');

$nbvt_url = 'http://nbvt.daniel';

$micro_site_info_url = $nbvt_url . '/api/v1/microsites?microsite=http://' . $cname;
$micro_sites_info = json_decode(file_get_contents($micro_site_info_url), TRUE);
$micro_site_info = end($micro_sites_info['microsite']);

file_put_contents('app/_data/microsite.json', stripslashes(json_encode($micro_site_info)));

foreach ($micro_site_info['components'] as $component) {
    $component_info_url = $nbvt_url . '/api/v1/' . $component . '?microsite=http://' . $cname;
    $component_info = json_decode(file_get_contents($component_info_url), TRUE);
    file_put_contents('app/_data/' . $component . '.json', stripslashes(json_encode($component_info)));

    if ($component == 'blogs') {


        foreach ($component_info['blog'] as $blog_nid => $blog_data) {
            $blog_url = $nbvt_url . '/node/' . $blog_nid . '/markdown';
            $blog = file_get_contents($blog_url);
            $file_name = get_real_filename($http_response_header, $blog_url);
            file_put_contents('app/_posts/' . $file_name, $blog);
        }
    }
}

function get_real_filename($headers, $url) {
    foreach($headers as $header)
    {
        if (strpos(strtolower($header),'content-disposition') !== false)
        {
            $tmp_name = explode('=', $header);
            if ($tmp_name[1]) return trim($tmp_name[1],'";\'');
        }
    }

    $stripped_url = preg_replace('/\\?.*/', '', $url);
    return basename($stripped_url);
}