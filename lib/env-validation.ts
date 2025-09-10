// Production environment validation utility

export function validateProductionEnvironment() {
  const errors: string[] = [];
  
  // Check for required environment variables
  const requiredEnvVars = [
    'DEPLOYER_PRIVATE_KEY',
    'INVITE_SECRET_KEY', 
    'NEXT_PUBLIC_CONTRACT_ADDRESS',
    'REDIS_URL',
    'REDIS_TOKEN'
  ];
  
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      errors.push(`Missing required environment variable: ${envVar}`);
    }
  }
  
  // Validate private key format
  if (process.env.DEPLOYER_PRIVATE_KEY && 
      (!process.env.DEPLOYER_PRIVATE_KEY.startsWith('0x') || 
       process.env.DEPLOYER_PRIVATE_KEY.length !== 66)) {
    errors.push('DEPLOYER_PRIVATE_KEY must be a valid 64-character hex private key starting with 0x');
  }
  
  // Validate secret key length
  if (process.env.INVITE_SECRET_KEY && process.env.INVITE_SECRET_KEY.length < 32) {
    errors.push('INVITE_SECRET_KEY must be at least 32 characters for security');
  }
  
  // Validate contract address format
  if (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS && 
      (!process.env.NEXT_PUBLIC_CONTRACT_ADDRESS.startsWith('0x') || 
       process.env.NEXT_PUBLIC_CONTRACT_ADDRESS.length !== 42)) {
    errors.push('NEXT_PUBLIC_CONTRACT_ADDRESS must be a valid Ethereum address');
  }
  
  // Production-specific validations
  if (process.env.NODE_ENV === 'production') {
    // Ensure GPS bypass is disabled in production
    if (process.env.NEXT_PUBLIC_DEV_SKIP_GPS === 'true') {
      errors.push('GPS bypass must be disabled in production (NEXT_PUBLIC_DEV_SKIP_GPS should not be true)');
    }
    
    // Check for development secrets
    const devSecrets = ['fallback', 'dev', 'test', 'localhost'];
    for (const secret of devSecrets) {
      if (process.env.INVITE_SECRET_KEY?.toLowerCase().includes(secret)) {
        errors.push('Production environment detected but using development secret key');
      }
    }
    
    // Validate secure REDIS URL
    if (process.env.REDIS_URL && !process.env.REDIS_URL.startsWith('redis://') && 
        !process.env.REDIS_URL.startsWith('rediss://')) {
      errors.push('REDIS_URL must use secure redis:// or rediss:// protocol');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Validate environment on module load in production
if (process.env.NODE_ENV === 'production') {
  const validation = validateProductionEnvironment();
  if (!validation.isValid) {
    console.error('❌ Production environment validation failed:');
    validation.errors.forEach(error => console.error(`   - ${error}`));
    throw new Error('Production environment validation failed. Check environment variables.');
  }
  console.log('✅ Production environment validation passed');
}