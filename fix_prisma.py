import re

with open('prisma/schema.prisma', 'r') as f:
    content = f.read()

# Replace Decimal with Float
content = content.replace('Decimal', 'Float')
# Remove any @db.Decimal128 or @db.Float128
content = re.sub(r'\s+@db\.(?:Decimal128|Float128)', '', content)

# Check if sessions is already in User model
if 'sessions' not in re.search(r'model User \{([\s\S]*?)\}', content).group(1):
    content = re.sub(r'(model User \{[\s\S]*?)(\})', r'\1  sessions      Session[]\n\2', content)

with open('prisma/schema.prisma', 'w') as f:
    f.write(content)
