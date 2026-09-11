const fs = require('fs');

let authContext = fs.readFileSync('src/context/AuthContext.tsx', 'utf-8');

authContext = authContext.replace("import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';", "import { User as FirebaseUser } from '@supabase/supabase-js';\nimport { supabase } from '../lib/supabase';");
authContext = authContext.replace("import { auth, db } from '../lib/firebase';", "");
authContext = authContext.replace("import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';", "");
authContext = authContext.replace("import { logout as firebaseLogout } from '../lib/firebase';", "import { logout as firebaseLogout } from '../lib/auth';");

fs.writeFileSync('src/context/AuthContext.tsx', authContext);
