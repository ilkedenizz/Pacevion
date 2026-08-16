$response = Invoke-RestMethod -Uri 'https://en.wikipedia.org/w/api.php?action=query&titles=Audi_in_Formula_One&prop=pageimages&format=json&pithumbsize=1000'
$pages = $response.query.pages
foreach ($page in $pages.PSObject.Properties) {
    $url = $page.Value.thumbnail.source
    if ($url) {
        Write-Host "Found Audi image: $url"
        Invoke-WebRequest -Uri $url -OutFile "public/assets/img/cars/audi.png"
    } else {
        Write-Host "No Audi image found."
    }
}

$response2 = Invoke-RestMethod -Uri 'https://en.wikipedia.org/w/api.php?action=query&titles=Cadillac_in_Formula_One&prop=pageimages&format=json&pithumbsize=1000'
$pages2 = $response2.query.pages
foreach ($page in $pages2.PSObject.Properties) {
    $url = $page.Value.thumbnail.source
    if ($url) {
        Write-Host "Found Cadillac image: $url"
        Invoke-WebRequest -Uri $url -OutFile "public/assets/img/cars/cadillac.png"
    } else {
        Write-Host "No Cadillac image found."
    }
}
