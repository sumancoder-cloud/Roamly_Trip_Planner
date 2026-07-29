from pathlib import Path
import re

root = Path('client/src')
converted = []
errors = []

# Convert .tsx files to .jsx source files
for path in sorted(root.rglob('*.tsx')):
    if 'node_modules' in path.parts:
        continue
    try:
        text = path.read_text(encoding='utf-8')
    except Exception as e:
        errors.append((path, str(e)))
        continue

    original = text
    # Remove type-only imports
    text = re.sub(r'import type [^\n]+\n', '', text)
    # Remove type exports and interfaces
    text = re.sub(r'export type [A-Za-z0-9_]+\s*=\s*[^;]+;', '', text)
    text = re.sub(r'type [A-Za-z0-9_]+\s*=\s*[^;]+;', '', text)
    text = re.sub(r'interface [A-Za-z0-9_]+\s*\{[^}]*\};?', '', text, flags=re.S)
    # Remove React.ComponentProps type annotations
    text = re.sub(r':\s*React\.ComponentProps<[^>]+>', '', text)
    text = re.sub(r':\s*React\.ComponentProps<[^>]+>\s*&\s*\{[^}]+\}', '', text, flags=re.S)
    # Remove explicit type annotations from function parameters
    text = re.sub(r'function (\w+)\((\{[^)]*\}):\s*[^)]+\)', r'function \1(\2)', text)
    text = re.sub(r'const (\w+)\s*=\s*\(([^)]*):\s*[^)]+\)\s*=>', r'const \1 = (\2) =>', text)
    text = re.sub(r'\buseRef<[^>]+>\(', 'useRef(', text)
    text = re.sub(r'\bReact\.useRef<[^>]+>\(', 'React.useRef(', text)
    text = re.sub(r'\buseState<[^>]+>\(', 'useState(', text)
    text = re.sub(r'\buseMemo<[^>]+>\(', 'useMemo(', text)
    text = re.sub(r'\buseCallback<[^>]+>\(', 'useCallback(', text)
    text = re.sub(r'\buseComposition<[^>]+>\(', 'useComposition(', text)
    # Remove type assertions
    text = re.sub(r'\s+as\s+React\.[A-Za-z0-9_<>]+', '', text)
    text = re.sub(r'\s+as\s+[^\n;]+', '', text)
    # Remove generic type params on React hooks and functions
    text = re.sub(r'(<[A-Za-z0-9_,\s]+>)\s*\(', '(', text)
    # Normalize import of React type helpers
    text = re.sub(r'import \* as React from "react";', 'import * as React from "react";', text)

    new_path = path.with_suffix('.jsx')
    new_path.write_text(text, encoding='utf-8')
    path.unlink()
    converted.append((path, new_path))

# Replace lucide-react imports to react-icons/fi across JS/JSX
icons = {
    'ArrowLeft': 'FiArrowLeft',
    'ArrowRight': 'FiArrowRight',
    'Compass': 'FiCompass',
    'Sparkles': 'FiStar',
    'ShieldCheck': 'FiShield',
    'Lock': 'FiLock',
    'Mail': 'FiMail',
    'Play': 'FiPlay',
    'Map': 'FiMap',
    'MessageSquare': 'FiMessageSquare',
    'Zap': 'FiZap',
    'Edit3': 'FiEdit3',
    'Calendar': 'FiCalendar',
    'GripHorizontal': 'FiMenu',
    'Clock': 'FiClock',
    'Shield': 'FiShield',
    'HeartHandshake': 'FiHeart',
    'BrainCircuit': 'FiCpu',
    'SendHorizonal': 'FiSend',
    'RotateCcw': 'FiRotateCcw',
    'MapPin': 'FiMapPin',
    'UserCircle2': 'FiUser',
    'CalendarDays': 'FiCalendar',
    'Wallet2': 'FiWallet',
    'Route': 'FiMap',
    'Trash2': 'FiTrash2',
    'GripVertical': 'FiMove',
    'ChevronDown': 'FiChevronDown',
    'ChevronUp': 'FiChevronUp',
    'ChevronLeft': 'FiChevronLeft',
    'ChevronRight': 'FiChevronRight',
    'CheckIcon': 'FiCheck',
    'CircleIcon': 'FiCircle',
    'SearchIcon': 'FiSearch',
    'XIcon': 'FiX',
    'MinusIcon': 'FiMinus',
    'MoreHorizontal': 'FiMoreHorizontal',
    'PanelLeftIcon': 'FiMenu',
    'Loader2Icon': 'FiLoader',
    'Sparkles': 'FiStar'
}

for path in sorted(root.rglob('*.*')):
    if path.suffix not in {'.js', '.jsx'}:
        continue
    if 'node_modules' in path.parts:
        continue
    text = path.read_text(encoding='utf-8')
    if 'lucide-react' not in text:
        continue
    # Replace import line
    imports = []
    for old, new in icons.items():
        if old in text:
            text = text.replace(old, new)
    text = re.sub(r'import \{[^}]+\} from "lucide-react";', '', text)
    text = re.sub(r'import \{[^}]+\} from \'lucide-react\';', '', text)
    text = re.sub(r'\n\s*\n', '\n\n', text)
    if 'react-icons/fi' in text or 'Fi' in text:
        # if already replacement occurred, add import at top
        pass
    # Add import statement if any Fi icons are used and no react-icons import exists
    if 'from "react-icons/fi"' not in text and 'Fi' in text:
        used_icons = sorted(set([v for v in icons.values() if v in text]))
        if used_icons:
            text = 'import { ' + ', '.join(used_icons) + ' } from "react-icons/fi";\n' + text
    path.write_text(text, encoding='utf-8')

# Update package.json dependency removal
pkg = Path('package.json')
if pkg.exists():
    pkg_text = pkg.read_text(encoding='utf-8')
    pkg_text = pkg_text.replace('"lucide-react": "^0.453.0",\n', '')
    pkg_text = pkg_text.replace('"lucide-react": "^0.453.0"\n', '')
    pkg.write_text(pkg_text, encoding='utf-8')

print(f'Converted {len(converted)} files, errors: {len(errors)}')
if errors:
    for p, e in errors[:10]:
        print(f'ERR {p}: {e}')
