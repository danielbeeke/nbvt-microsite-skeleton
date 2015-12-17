<?php

$cname = file_get_contents('CNAME');

$micro_site_info_url = 'http://nbvt.daniel/api/v1/microsites?microsite=http://' . $cname;
$micro_sites_info = json_decode(file_get_contents($micro_site_info_url), TRUE);
$micro_site_info = end($micro_sites_info['microsite']);

file_put_contents('app/_data/microsite.json', stripslashes(json_encode($micro_site_info)));

foreach ($micro_site_info['components'] as $component) {
    $component_info_url = 'http://nbvt.daniel/api/v1/' . $component . '?microsite=http://' . $cname;
    $component_info = json_decode(file_get_contents($component_info_url), TRUE);
    file_put_contents('app/_data/' . $component . '.json', stripslashes(json_encode($component_info)));
}