const { getPageRes, getAllEntries } = require('./helper');

async function debugContentstack() {
  console.log('Testing Contentstack connection...');
  
  try {
    console.log('1. Testing getAllEntries...');
    const allEntries = await getAllEntries();
    console.log('All entries:', allEntries?.length || 0, 'entries found');
    
    if (allEntries && allEntries.length > 0) {
      console.log('Available page URLs:');
      allEntries.forEach((entry, index) => {
        console.log(`  ${index + 1}. URL: "${entry.url}" - Title: "${entry.title}"`);
      });
    }
    
    console.log('\n2. Testing getPageRes with "/"...');
    const homePage = await getPageRes('/');
    console.log('Home page result:', homePage ? 'Found' : 'Not found');
    
    if (homePage) {
      console.log('Home page title:', homePage.title);
    }
    
  } catch (error) {
    console.error('Error testing Contentstack:', error);
  }
}

debugContentstack();