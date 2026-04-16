$port = 8080
$path = "C:\Users\4-410-28\Desktop\e\amk-portfolio"

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

Write-Host "Started HTTP server on http://localhost:$port/"
try {
    while ($true) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $urlPath = $request.Url.LocalPath.Replace("/", "\").TrimStart('\')
        if ($urlPath -eq "") { $urlPath = "index.html" }
        $fullPath = Join-Path $path $urlPath

        if (Test-Path $fullPath) {
            $buffer = [System.IO.File]::ReadAllBytes($fullPath)
            $response.ContentLength64 = $buffer.Length
            
            if ($fullPath -match '\.html$') { $response.ContentType = "text/html" }
            elseif ($fullPath -match '\.css$') { $response.ContentType = "text/css" }
            elseif ($fullPath -match '\.js$') { $response.ContentType = "application/javascript" }
            
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
        } else {
            $response.StatusCode = 404
            $err = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.OutputStream.Write($err, 0, $err.Length)
        }
        $response.Close()
    }
} finally {
    $listener.Stop()
}
