import os
import zipfile

EXCLUDE_DIRS = {
    'node_modules',
    '.git',
    'dist',
    '.vite',
    '.cache',
    '__pycache__',
    '.turbo'
}

EXCLUDE_EXTENSIONS = {
    '.zip',
    '.pyc'
}

EXCLUDE_FILES = {
    'create_zip.py'
}

def create_project_zip(output_path, root_dir):
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    count = 0
    with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(root_dir):
            # Prune excluded directories in place
            dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS and not d.startswith('.')]
            
            for file in files:
                if file in EXCLUDE_FILES:
                    continue
                ext = os.path.splitext(file)[1].lower()
                if ext in EXCLUDE_EXTENSIONS:
                    continue
                if file.startswith('.'):
                    # allow .env.example, .gitignore
                    if file not in {'.env.example', '.gitignore'}:
                        continue

                file_path = os.path.join(root, file)
                rel_path = os.path.relpath(file_path, root_dir)
                
                # Double check that no excluded folder is in rel_path
                parts = rel_path.split(os.sep)
                if any(p in EXCLUDE_DIRS for p in parts):
                    continue

                zipf.write(file_path, rel_path)
                count += 1
                
    file_size_mb = os.path.getsize(output_path) / (1024 * 1024)
    print(f"Successfully zipped {count} files to {output_path} ({file_size_mb:.2f} MB)")

if __name__ == '__main__':
    workspace_root = os.path.abspath('.')
    
    # 1. Save in public directory for direct client browser download
    public_zip = os.path.join(workspace_root, 'public', 'railpulse-app.zip')
    create_project_zip(public_zip, workspace_root)
    
    # 2. Also save in root directory
    root_zip = os.path.join(workspace_root, 'railpulse-app.zip')
    create_project_zip(root_zip, workspace_root)
