#!/usr/bin/env node
const https = require('https');
const fs = require('fs');
const path = require('path');

// Create a simple script to download Cosmic Charlie from Archive.org
async function downloadCosmicCharlie() {
  const outputPath = path.join(__dirname, '..', 'public', 'music', 'gratefulDeadSample.mp3');
  
  // Try the Aoxomoxoa studio version first (most accessible)
  const url = 'https://archive.org/download/grateful-dead-1969.-aoxomoxoa/07%20-%20Cosmic%20Charlie.mp3';
  
  console.log('Downloading Cosmic Charlie from Archive.org...');
  console.log('URL:', url);
  console.log('Output:', outputPath);
  
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);
    
    function downloadFile(downloadUrl) {
      https.get(downloadUrl, (response) => {
        if (response.statusCode === 200) {
          response.pipe(file);
          
          file.on('finish', () => {
            file.close();
            console.log('✅ Downloaded Cosmic Charlie successfully!');
            console.log('File size:', fs.statSync(outputPath).size, 'bytes');
            resolve();
          });
        } else if (response.statusCode === 302 || response.statusCode === 301) {
          // Follow redirect
          const redirectUrl = response.headers.location;
          console.log('📍 Following redirect to:', redirectUrl);
          file.close();
          fs.unlink(outputPath, () => {}); // Delete incomplete file
          downloadFile(redirectUrl);
        } else {
          console.error('❌ Download failed with status:', response.statusCode);
          console.error('Headers:', response.headers);
          reject(new Error(`HTTP ${response.statusCode}`));
        }
      }).on('error', (err) => {
        fs.unlink(outputPath, () => {}); // Delete incomplete file
        console.error('❌ Download error:', err.message);
        reject(err);
      });
    }
    
    downloadFile(url);
  });
}

// Run the download
downloadCosmicCharlie()
  .then(() => {
    console.log('🎵 Cosmic Charlie is ready for your psychedelic experience!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💀 Failed to download Cosmic Charlie:', error.message);
    process.exit(1);
  });