const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

// CSS files in order (matching index.html)
const cssFiles = [
  'css/variables.css',
  'css/base.css',
  'css/layout.css',
  'css/components/buttons.css',
  'css/components/cards.css',
  'css/components/navigation.css',
  'css/components/modal.css',
  'css/components/toast.css',
  'css/sections/hero.css',
  'css/sections/about.css',
  'css/sections/skills.css',
  'css/sections/projects.css',
  'css/sections/growth.css',
  'css/sections/contact.css',
  'css/sections/footer.css',
  'css/responsive.css',
];

async function build() {
  console.log('🔨 Building production bundle...\n');

  // 1. Bundle + minify JS
  console.log('📦 Bundling & minifying JavaScript...');
  await esbuild.build({
    entryPoints: ['js/main.js'],
    bundle: true,
    minify: true,
    format: 'iife',
    outfile: 'dist/app.min.js',
    target: ['es2020'],
    legalComments: 'none',
    mangleProps: /^_/,
  });
  console.log('   ✅ dist/app.min.js');

  // 2. Concatenate + minify CSS
  console.log('📦 Bundling & minifying CSS...');
  let combinedCSS = '';
  for (const file of cssFiles) {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      combinedCSS += fs.readFileSync(filePath, 'utf8') + '\n';
    }
  }

  // Use esbuild's CSS minifier
  const cssResult = await esbuild.transform(combinedCSS, {
    loader: 'css',
    minify: true,
    legalComments: 'none',
  });
  fs.writeFileSync('dist/style.min.css', cssResult.code);
  console.log('   ✅ dist/style.min.css');

  // 3. Minify HTML
  console.log('📦 Minifying HTML...');
  let html = fs.readFileSync('index.html', 'utf8');

  // Replace all CSS links with single minified CSS
  const cssLinksRegex = /\s*<!-- CSS -->[\s\S]*?<link rel="stylesheet" href="css\/responsive\.css\?v=3">/;
  html = html.replace(cssLinksRegex, '\n    <link rel="stylesheet" href="dist/style.min.css">');

  // Replace module script with minified bundle
  html = html.replace(
    '<script type="module" src="js/main.js"></script>',
    '<script src="dist/app.min.js"></script>'
  );

  // Remove HTML comments (except IE conditionals)
  html = html.replace(/<!--(?!\[)[\s\S]*?-->/g, '');

  // Collapse whitespace
  html = html.replace(/\n\s*\n/g, '\n');
  html = html.replace(/>\s+</g, '><');

  // Restore some readability for the structured data
  fs.writeFileSync('index.prod.html', html);
  console.log('   ✅ index.prod.html');

  console.log('\n🎉 Build complete! Serve with: npx serve . and open index.prod.html');
}

build().catch(err => { console.error(err); process.exit(1); });
