import { KeyHelper, SessionBuilder, SessionCipher } from 'libsignal-protocol';

// Initialize key helper and generate identity keys
const keyHelper = new KeyHelper();
const identityKeyPair = keyHelper.generateIdentityKeyPair();