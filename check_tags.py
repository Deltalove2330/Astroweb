import sys
from html.parser import HTMLParser

class TagChecker(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack = []
        self.line_offset = 0

    def handle_starttag(self, tag, attrs):
        if tag not in ['img', 'br', 'hr', 'input', 'canvas']:
            self.stack.append((tag, self.getpos()))

    def handle_endtag(self, tag):
        if tag not in ['img', 'br', 'hr', 'input', 'canvas']:
            if not self.stack:
                print(f"Error: Unexpected closing tag </{tag}> at line {self.getpos()[0]}")
                return
            last_tag, pos = self.stack.pop()
            if last_tag != tag:
                print(f"Error: Mismatched tag. Expected </{last_tag}> (opened at {pos[0]}), got </{tag}> at line {self.getpos()[0]}")

parser = TagChecker()
with open('AppWeb_v2/frontend/src/app/features/cliente-encuestador/cliente-encuestador-dashboard.component.html', 'r', encoding='utf-8') as f:
    parser.feed(f.read())
if parser.stack:
    print(f"Error: Unclosed tags: {parser.stack}")
