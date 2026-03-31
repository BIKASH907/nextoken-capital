const fs = require('fs');
let totalFixes = 0;

const allPages = [
  'pages/about.js', 'pages/bonds.js', 'pages/equity-ipo.js',
  'pages/fees.js', 'pages/terms.js', 'pages/learn.js',
  'pages/compliance.js', 'pages/company.js', 'pages/company-pages.js',
  'pages/careers.js', 'pages/aml.js', 'pages/institutional.js',
  'pages/press.js', 'components/Hero.js',
];

// Global replacements — every page
const globalReplacements = [
  ['Bank of Lithuania', 'Lithuanian authorities'],
  ['bank of Lithuania', 'Lithuanian authorities'],
  ['Lietuvos bankas', 'Lithuanian authorities'],
  ['EMI License', 'UAB Registration'],
  ['EMI license', 'UAB registration'],
  ['EU-regulated', 'EU-based'],
  ['EU regulated', 'EU-based'],
  ['eu regulated', 'eu-based'],
  ['fully regulated', 'fully compliant'],
  ['Fully Regulated', 'Fully Compliant'],
  ['regulated platform', 'compliant marketplace'],
  ['regulated marketplace', 'compliant marketplace'],
  ['regulated infrastructure', 'compliant infrastructure'],
  ['regulated tokenization', 'compliant tokenization'],
  ['regulated digital', 'tokenized digital'],
  ['regulated blockchain', 'compliant blockchain'],
  ['regulated exchange', 'compliant marketplace'],
  ['regulated environment', 'compliant environment'],
  ['regulated framework', 'compliant framework'],
  ['regulated asset', 'tokenized asset'],
  ['regulated on-chain', 'compliant on-chain'],
  ['under regulated', 'under compliant'],
  ['is regulated', 'is compliant'],
  ['are regulated', 'are compliant'],
  ['authorized and monitored', 'registered and operating'],
  ['authorized by', 'registered in'],
  ['authorized under', 'operating under'],
  ['authorized as', 'registered as'],
  ['licensed and', 'registered and'],
  ['licensed by', 'registered with'],
  ['licensed under', 'operating under'],
  ['licensed platform', 'registered platform'],
  ['licensed provider', 'registered provider'],
  ['licensed entity', 'registered entity'],
  ['Electronic Money Institution', 'technology marketplace company'],
  ['electronic money institution', 'technology marketplace company'],
];

allPages.forEach(file => {
  if (!fs.existsSync(file)) return;
  let code = fs.readFileSync(file, 'utf8');
  let fileFixes = 0;
  
  globalReplacements.forEach(([from, to]) => {
    const count = code.split(from).length - 1;
    if (count > 0) {
      code = code.split(from).join(to);
      fileFixes += count;
    }
  });
  
  if (fileFixes > 0) {
    fs.writeFileSync(file, code);
    console.log('Fixed: ' + file + ' (' + fileFixes + ' replacements)');
    totalFixes += fileFixes;
  }
});

// Final scan
console.log('\n=== FINAL SCAN ===');
const danger = ['Bank of Lithuania', 'EMI License', 'EU regulated', 'EU-regulated', 'authorized by', 'authorized and', 'risk-free', 'guaranteed return', 'Invest Now'];
let remaining = 0;
allPages.forEach(file => {
  if (!fs.existsSync(file)) return;
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  danger.forEach(word => {
    lines.forEach((line, i) => {
      if (line.includes(word) && !line.includes('//') && !line.includes('import')) {
        console.log('  STILL: ' + file + ':' + (i+1) + ' -> "' + word + '"');
        remaining++;
      }
    });
  });
});
console.log('\nTotal: ' + totalFixes + ' fixes. ' + remaining + ' dangerous phrases remaining.');
