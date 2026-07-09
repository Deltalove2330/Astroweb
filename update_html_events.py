import re

file_path = r'AppWeb_v2\frontend\src\app\features\cliente-encuestador\cliente-encuestador-dashboard.component.html'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove the "Actualizar Datos" button
button_pattern = r'<button[^>]*\(click\)="loadData\(\)"[^>]*>.*?</button>'
content = re.sub(button_pattern, '', content, flags=re.DOTALL)

# 2. Add (ngModelChange) to inputs and mat-selects inside the filters area
# The filters are in a grid. We can just replace all `[(ngModel)]="filters.` with `(ngModelChange)="onFilterChange()" [(ngModel)]="filters.`
# but we have to be careful not to duplicate it if it's already there (it isn't).
content = content.replace('[(ngModel)]="filters.', '(ngModelChange)="onFilterChange()" [(ngModel)]="filters.')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated HTML!")
