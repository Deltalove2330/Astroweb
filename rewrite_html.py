import re

file_path = r'AppWeb_v2\frontend\src\app\features\cliente-encuestador\cliente-encuestador-dashboard.component.html'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

def replace_field(match):
    full_match = match.group(0)
    label_text = match.group(1)
    
    # Remove mat-label
    new_field = re.sub(r'<mat-label[^>]*>.*?</mat-label>', '', full_match, flags=re.DOTALL)
    
    # Add panelClass and placeholder to mat-select
    # Only if it doesn't already have panelClass
    if 'panelClass=' not in new_field:
        new_field = re.sub(r'<mat-select', f'<mat-select panelClass="dark-dropdown" placeholder="{label_text}"', new_field)
    
    # Check if already wrapped
    if 'flex flex-col gap-1' in full_match:
        return full_match
        
    # Wrap in a div with a native label
    html = f'''<div class="flex flex-col gap-1">
          <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">{label_text}</label>
          {new_field.strip()}
        </div>'''
    return html

pattern = r'<mat-form-field appearance="outline" class="w-full dense-field" subscriptSizing="dynamic">\s*<mat-label[^>]*>(.*?)</mat-label>.*?</mat-form-field>'

new_content = re.sub(pattern, replace_field, content, flags=re.DOTALL)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)
print('Done!')
