from django.http import FileResponse, HttpResponse
from django.views.static import serve as static_serve
import os

PUBLIC_DIR = "/home/haejqixc/Liquidity/public"

def index(request):
    index_path = os.path.join(PUBLIC_DIR, "index.html")
    if os.path.exists(index_path):
        return FileResponse(open(index_path, "rb"), content_type="text/html")
    return HttpResponse("index.html not found", status=404)

def assets(request, path):
    return static_serve(request, path, document_root=PUBLIC_DIR)
