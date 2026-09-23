const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbFilePath = path.join(__dirname, 'db.json');

// Generate MongoDB-like 24-character hexadecimal ID
function generateId() {
  const timestamp = ((new Date().getTime() / 1000) | 0).toString(16).padStart(8, '0');
  const random = Math.random().toString(16).substring(2, 18).padStart(16, '0');
  return (timestamp + random).substring(0, 24);
}

// In-memory state
let data = {
  users: [],
  items: [],
  claims: [],
  notifications: [],
};

// Initial realistic seed dataset
function getInitialSeedData() {
  const adminSalt = bcrypt.genSaltSync(10);
  const userSalt = bcrypt.genSaltSync(10);

  const adminPasswordHash = bcrypt.hashSync('adminpassword123', adminSalt);
  const userPasswordHash = bcrypt.hashSync('userpassword123', userSalt);

  const adminId = '66d0a0000000000000000001';
  const user1Id = '66d0a0000000000000000002';
  const user2Id = '66d0a0000000000000000003';
  const user3Id = '66d0a0000000000000000004';

  const item1Id = '66d0b0000000000000000001';
  const item2Id = '66d0b0000000000000000002';
  const item3Id = '66d0b0000000000000000003';
  const item4Id = '66d0b0000000000000000004';
  const item5Id = '66d0b0000000000000000005';
  const item6Id = '66d0b0000000000000000006';
  const item7Id = '66d0b0000000000000000007';
  const item8Id = '66d0b0000000000000000008';

  const claim1Id = '66d0c0000000000000000001';
  const claim2Id = '66d0c0000000000000000002';

  const notif1Id = '66d0d0000000000000000001';
  const notif2Id = '66d0d0000000000000000002';

  const now = Date.now();

  const users = [
    {
      _id: adminId,
      name: 'Campus Security Admin',
      email: 'admin@shodh.org',
      password: adminPasswordHash,
      phone: '+91 98765 43210',
      role: 'admin',
      bio: 'Official Campus Security & Lost-Found Desk Administrator',
      avatar: '',
      createdAt: new Date(now - 1000 * 60 * 60 * 24 * 30).toISOString(),
      updatedAt: new Date(now - 1000 * 60 * 60 * 24 * 30).toISOString(),
    },
    {
      _id: user1Id,
      name: 'Aarav Sharma',
      email: 'aarav@shodh.org',
      password: userPasswordHash,
      phone: '+91 91234 56789',
      role: 'user',
      bio: 'B.Tech Computer Science | Year 3',
      avatar: '',
      createdAt: new Date(now - 1000 * 60 * 60 * 24 * 20).toISOString(),
      updatedAt: new Date(now - 1000 * 60 * 60 * 24 * 20).toISOString(),
    },
    {
      _id: user2Id,
      name: 'Priya Patel',
      email: 'priya@shodh.org',
      password: userPasswordHash,
      phone: '+91 99887 76655',
      role: 'user',
      bio: 'Biotechnology Dept | Year 2',
      avatar: '',
      createdAt: new Date(now - 1000 * 60 * 60 * 24 * 15).toISOString(),
      updatedAt: new Date(now - 1000 * 60 * 60 * 24 * 15).toISOString(),
    },
    {
      _id: user3Id,
      name: 'Rohit Verma',
      email: 'rohit@shodh.org',
      password: userPasswordHash,
      phone: '+91 94455 66778',
      role: 'user',
      bio: 'Mechanical Engineering | Year 4',
      avatar: '',
      createdAt: new Date(now - 1000 * 60 * 60 * 24 * 10).toISOString(),
      updatedAt: new Date(now - 1000 * 60 * 60 * 24 * 10).toISOString(),
    },
  ];

  const items = [
    {
      _id: item1Id,
      title: 'MacBook Pro 14" (Space Grey) in Black Sleeve',
      description:
        'Left my Space Grey MacBook Pro inside a dark grey felt sleeve on table 14 near the silent reading section. It has stickers of GitHub and React on the lid.',
      category: 'Electronics',
      type: 'lost',
      location: {
        placeName: 'Central Library 3rd Floor',
        city: 'Main Campus',
        landmark: 'Table #14 near Silent Zone',
      },
      dateLostOrFound: new Date(now - 1000 * 60 * 60 * 24 * 2).toISOString(),
      status: 'active',
      reward: '₹2,000 & Eternal Gratitude',
      contactName: 'Aarav Sharma',
      contactPhone: '+91 91234 56789',
      contactEmail: 'aarav@shodh.org',
      secretQuestion: 'What is the background wallpaper of the login screen?',
      postedBy: user1Id,
      claimedBy: null,
      tags: ['macbook', 'apple', 'laptop', 'library'],
      viewsCount: 42,
      createdAt: new Date(now - 1000 * 60 * 60 * 24 * 2).toISOString(),
      updatedAt: new Date(now - 1000 * 60 * 60 * 24 * 2).toISOString(),
    },
    {
      _id: item2Id,
      title: 'Apple AirPods Pro (2nd Gen) with Matte Blue Protective Case',
      description:
        'Found a pair of AirPods Pro in a matte dark blue silicon case with a small carabiner. Left behind on the center dining table.',
      category: 'Electronics',
      type: 'found',
      location: {
        placeName: 'Student Food Court / Cafeteria',
        city: 'Main Campus',
        landmark: 'Table #8 near Juice Bar',
      },
      dateLostOrFound: new Date(now - 1000 * 60 * 60 * 18).toISOString(),
      status: 'active',
      reward: '',
      contactName: 'Priya Patel',
      contactPhone: '+91 99887 76655',
      contactEmail: 'priya@shodh.org',
      secretQuestion: 'What name is etched inside or appears on Bluetooth connect?',
      postedBy: user2Id,
      claimedBy: null,
      tags: ['airpods', 'apple', 'earbuds', 'cafeteria'],
      viewsCount: 65,
      createdAt: new Date(now - 1000 * 60 * 60 * 18).toISOString(),
      updatedAt: new Date(now - 1000 * 60 * 60 * 18).toISOString(),
    },
    {
      _id: item3Id,
      title: 'Brown Leather Fossil Wallet with ID & Metro Card',
      description:
        'Lost brown bifold Fossil wallet. Contains national identity card, campus student card, metro pass, and some cash. Very urgent as it has important documents.',
      category: 'Wallets & Bags',
      type: 'lost',
      location: {
        placeName: 'Auditorium Gate 2',
        city: 'North Campus',
        landmark: 'Near the bicycle parking lot',
      },
      dateLostOrFound: new Date(now - 1000 * 60 * 60 * 36).toISOString(),
      status: 'active',
      reward: '₹500 Treat',
      contactName: 'Rohit Verma',
      contactPhone: '+91 94455 66778',
      contactEmail: 'rohit@shodh.org',
      postedBy: user3Id,
      claimedBy: null,
      tags: ['wallet', 'money', 'fossil', 'id-card'],
      viewsCount: 28,
      createdAt: new Date(now - 1000 * 60 * 60 * 36).toISOString(),
      updatedAt: new Date(now - 1000 * 60 * 60 * 36).toISOString(),
    },
    {
      _id: item4Id,
      title: 'Official University Student ID Card - Aarav Sharma',
      description:
        'Found a student ID card belonging to Computer Science dept. Safely kept with Department Lab Assistant.',
      category: 'Documents & IDs',
      type: 'found',
      location: {
        placeName: 'Computer Lab 3 (Turing Block)',
        city: 'Main Campus',
        landmark: 'Workstation 19',
      },
      dateLostOrFound: new Date(now - 1000 * 60 * 60 * 12).toISOString(),
      status: 'active',
      contactName: 'Campus Security Admin',
      contactPhone: '+91 98765 43210',
      contactEmail: 'admin@shodh.org',
      postedBy: adminId,
      claimedBy: null,
      tags: ['id card', 'student id', 'cs dept'],
      viewsCount: 15,
      createdAt: new Date(now - 1000 * 60 * 60 * 12).toISOString(),
      updatedAt: new Date(now - 1000 * 60 * 60 * 12).toISOString(),
    },
    {
      _id: item5Id,
      title: 'Set of 4 Brass Keys with Captain America Keychain',
      description:
        'Found a key ring with 4 metallic keys and a circular Captain America shield keychain hanging on the fence near the bus shelter.',
      category: 'Keys',
      type: 'found',
      location: {
        placeName: 'Campus Main Gate Bus Shelter',
        city: 'Main Campus',
        landmark: 'Shelter bench #2',
      },
      dateLostOrFound: new Date(now - 1000 * 60 * 60 * 48).toISOString(),
      status: 'active',
      contactName: 'Rohit Verma',
      contactPhone: '+91 94455 66778',
      contactEmail: 'rohit@shodh.org',
      postedBy: user3Id,
      claimedBy: null,
      tags: ['keys', 'keychain', 'marvel', 'bus stop'],
      viewsCount: 19,
      createdAt: new Date(now - 1000 * 60 * 60 * 48).toISOString(),
      updatedAt: new Date(now - 1000 * 60 * 60 * 48).toISOString(),
    },
    {
      _id: item6Id,
      title: 'Casio FX-991EX Scientific Calculator (Black)',
      description:
        'Lost during afternoon Engineering Mathematics exam. Back cover has a small barcode sticker and initials "PP".',
      category: 'Books & Stationery',
      type: 'lost',
      location: {
        placeName: 'Examination Hall Block B',
        city: 'East Wing',
        landmark: 'Row 4 Seat 22',
      },
      dateLostOrFound: new Date(now - 1000 * 60 * 60 * 72).toISOString(),
      status: 'active',
      reward: 'Coffee Treat ☕',
      contactName: 'Priya Patel',
      contactPhone: '+91 99887 76655',
      contactEmail: 'priya@shodh.org',
      postedBy: user2Id,
      claimedBy: null,
      tags: ['calculator', 'casio', 'exam hall'],
      viewsCount: 33,
      createdAt: new Date(now - 1000 * 60 * 60 * 72).toISOString(),
      updatedAt: new Date(now - 1000 * 60 * 60 * 72).toISOString(),
    },
    {
      _id: item7Id,
      title: 'Sony WH-1000XM4 Wireless Noise Cancelling Headphones',
      description:
        'Found black Sony over-ear headphones inside their black travel case in the Seminar Room after the guest lecture.',
      category: 'Electronics',
      type: 'found',
      location: {
        placeName: 'Management Auditorium / Seminar Hall',
        city: 'Main Campus',
        landmark: 'Row H Seat 12',
      },
      dateLostOrFound: new Date(now - 1000 * 60 * 60 * 96).toISOString(),
      status: 'handed_over',
      claimedBy: user1Id,
      contactName: 'Priya Patel',
      contactPhone: '+91 99887 76655',
      contactEmail: 'priya@shodh.org',
      postedBy: user2Id,
      tags: ['sony', 'headphones', 'music', 'resolved'],
      viewsCount: 88,
      createdAt: new Date(now - 1000 * 60 * 60 * 96).toISOString(),
      updatedAt: new Date(now - 1000 * 60 * 60 * 96).toISOString(),
    },
    {
      _id: item8Id,
      title: 'Titan Octane Chronograph Watch (Silver Stainless Steel)',
      description:
        'Left my watch on the wooden bench beside the indoor badminton court while changing into sports gear.',
      category: 'Jewelry & Watches',
      type: 'lost',
      location: {
        placeName: 'Indoor Sports Complex',
        city: 'Sports Arena',
        landmark: 'Badminton Court 3 changing bench',
      },
      dateLostOrFound: new Date(now - 1000 * 60 * 60 * 50).toISOString(),
      status: 'active',
      reward: '₹1,000 Cash Reward',
      contactName: 'Rohit Verma',
      contactPhone: '+91 94455 66778',
      contactEmail: 'rohit@shodh.org',
      postedBy: user3Id,
      claimedBy: null,
      tags: ['watch', 'titan', 'sports complex'],
      viewsCount: 47,
      createdAt: new Date(now - 1000 * 60 * 60 * 50).toISOString(),
      updatedAt: new Date(now - 1000 * 60 * 60 * 50).toISOString(),
    },
  ];

  const claims = [
    {
      _id: claim1Id,
      item: item7Id,
      claimant: user1Id,
      claimantName: 'Aarav Sharma',
      claimantPhone: '+91 91234 56789',
      claimantEmail: 'aarav@shodh.org',
      proofDescription:
        'It has a tiny scratch on the left pivot and is paired with my phone named "Aarav\'s Phone". The travel case also contains the airplane adapter.',
      proofImageUrl: '',
      status: 'approved',
      adminOrOwnerNotes: 'Verified Bluetooth pairing and accessory in case. Handed over successfully!',
      createdAt: new Date(now - 1000 * 60 * 60 * 90).toISOString(),
      updatedAt: new Date(now - 1000 * 60 * 60 * 90).toISOString(),
    },
    {
      _id: claim2Id,
      item: item2Id,
      claimant: user3Id,
      claimantName: 'Rohit Verma',
      claimantPhone: '+91 94455 66778',
      claimantEmail: 'rohit@shodh.org',
      proofDescription:
        'The AirPods case has a small sticker residue on the bottom, and the device name on iCloud is "Rohit\'s AirPods Pro".',
      proofImageUrl: '',
      status: 'pending',
      adminOrOwnerNotes: '',
      createdAt: new Date(now - 1000 * 60 * 60 * 10).toISOString(),
      updatedAt: new Date(now - 1000 * 60 * 60 * 10).toISOString(),
    },
  ];

  const notifications = [
    {
      _id: notif1Id,
      recipient: user2Id,
      sender: user3Id,
      item: item2Id,
      claim: claim2Id,
      type: 'claim_received',
      message: 'Rohit Verma submitted a claim on your found listing: "Apple AirPods Pro (2nd Gen) with Matte Blue Protective Case".',
      read: false,
      createdAt: new Date(now - 1000 * 60 * 60 * 10).toISOString(),
      updatedAt: new Date(now - 1000 * 60 * 60 * 10).toISOString(),
    },
    {
      _id: notif2Id,
      recipient: user1Id,
      sender: user2Id,
      item: item7Id,
      claim: claim1Id,
      type: 'claim_approved',
      message: '🎉 Great news! Your claim for "Sony WH-1000XM4 Wireless Noise Cancelling Headphones" was approved by Priya Patel. Contact: +91 99887 76655',
      read: true,
      createdAt: new Date(now - 1000 * 60 * 60 * 85).toISOString(),
      updatedAt: new Date(now - 1000 * 60 * 60 * 85).toISOString(),
    },
  ];

  return { users, items, claims, notifications };
}

// Load from disk or initialize seed
function loadDB() {
  try {
    if (fs.existsSync(dbFilePath)) {
      const content = fs.readFileSync(dbFilePath, 'utf8');
      if (content && content.trim()) {
        data = JSON.parse(content);
        return;
      }
    }
  } catch (err) {
    console.warn('Could not read db.json, creating initial store:', err.message);
  }

  data = getInitialSeedData();
  saveDB();
}

// Save to disk
function saveDB() {
  try {
    const dir = path.dirname(dbFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to save db.json:', err.message);
  }
}

// Helper: match document against MongoDB-like query
function matchesQuery(doc, query = {}) {
  if (!query || Object.keys(query).length === 0) return true;

  for (let key of Object.keys(query)) {
    const val = query[key];

    if (key === '$or') {
      const orMatches = val.some((cond) => matchesQuery(doc, cond));
      if (!orMatches) return false;
      continue;
    }

    if (key === '$and') {
      const andMatches = val.every((cond) => matchesQuery(doc, cond));
      if (!andMatches) return false;
      continue;
    }

    // Handle nested property lookup e.g. 'location.placeName'
    const docVal = getNestedValue(doc, key);

    if (val && typeof val === 'object' && !(val instanceof RegExp)) {
      if ('$in' in val) {
        if (!Array.isArray(val.$in)) return false;
        if (Array.isArray(docVal)) {
          const hasAny = docVal.some((v) =>
            val.$in.some((inVal) => matchesValue(v, inVal))
          );
          if (!hasAny) return false;
        } else {
          const matchesIn = val.$in.some((inVal) => matchesValue(docVal, inVal));
          if (!matchesIn) return false;
        }
        continue;
      }

      if ('$regex' in val) {
        const regex = new RegExp(val.$regex, val.$options || '');
        if (!regex.test(String(docVal || ''))) return false;
        continue;
      }

      if ('$gte' in val || '$lte' in val) {
        const docTime = new Date(docVal).getTime();
        if ('$gte' in val && docTime < new Date(val.$gte).getTime()) return false;
        if ('$lte' in val && docTime > new Date(val.$lte).getTime()) return false;
        continue;
      }
    }

    if (val instanceof RegExp) {
      if (Array.isArray(docVal)) {
        if (!docVal.some((dv) => val.test(String(dv)))) return false;
      } else {
        if (!val.test(String(docVal || ''))) return false;
      }
      continue;
    }

    if (!matchesValue(docVal, val)) {
      return false;
    }
  }

  return true;
}

function matchesValue(actual, target) {
  if (actual === target) return true;
  if (String(actual) === String(target)) return true;
  return false;
}

function getNestedValue(obj, pathStr) {
  if (!obj) return undefined;
  const parts = pathStr.split('.');
  let curr = obj;
  for (let p of parts) {
    if (curr == null) return undefined;
    curr = curr[p];
  }
  return curr;
}

// Chainable Query Builder
class QueryBuilder {
  constructor(collectionName, query = {}) {
    this.collectionName = collectionName;
    this.query = query;
    this.populateFields = [];
    this.sortOptions = null;
    this.skipCount = 0;
    this.limitCount = 0;
    this.selectedFields = null;
  }

  populate(field, select) {
    this.populateFields.push({ field, select });
    return this;
  }

  sort(options) {
    this.sortOptions = options;
    return this;
  }

  skip(n) {
    this.skipCount = n || 0;
    return this;
  }

  limit(n) {
    this.limitCount = n || 0;
    return this;
  }

  select(fields) {
    this.selectedFields = fields;
    return this;
  }

  async exec() {
    let list = (data[this.collectionName] || []).filter((doc) =>
      matchesQuery(doc, this.query)
    );

    // Deep clone items so instance modifications don't mutate unexpectedly
    let results = JSON.parse(JSON.stringify(list));

    // Sort
    if (this.sortOptions) {
      results.sort((a, b) => {
        for (let k of Object.keys(this.sortOptions)) {
          const dir = this.sortOptions[k] === -1 ? -1 : 1;
          let aVal = getNestedValue(a, k);
          let bVal = getNestedValue(b, k);
          if (k.toLowerCase().includes('date') || k === 'createdAt' || k === 'updatedAt') {
            aVal = new Date(aVal).getTime();
            bVal = new Date(bVal).getTime();
          }
          if (aVal < bVal) return -1 * dir;
          if (aVal > bVal) return 1 * dir;
        }
        return 0;
      });
    }

    // Skip
    if (this.skipCount > 0) {
      results = results.slice(this.skipCount);
    }

    // Limit
    if (this.limitCount > 0) {
      results = results.slice(0, this.limitCount);
    }

    // Populate references
    for (let pop of this.populateFields) {
      for (let item of results) {
        await populateItem(item, pop, this.collectionName);
      }
    }

    return results.map((r) => wrapDocument(r, this.collectionName));
  }

  then(resolve, reject) {
    return this.exec().then(resolve, reject);
  }
}

async function populateItem(item, pop, collectionName) {
  const { field, select } = pop;

  if (typeof field === 'object' && field.path) {
    // Nested populate e.g. { path: 'item', populate: { path: 'postedBy', select: '...' } }
    const targetId = item[field.path];
    if (targetId) {
      const targetDoc = data.items.find((i) => i._id === String(targetId._id || targetId));
      if (targetDoc) {
        let cloned = JSON.parse(JSON.stringify(targetDoc));
        if (field.populate && field.populate.path === 'postedBy') {
          const userDoc = data.users.find((u) => u._id === String(cloned.postedBy));
          if (userDoc) {
            cloned.postedBy = filterSelected(userDoc, field.populate.select);
          }
        }
        item[field.path] = cloned;
      }
    }
    return;
  }

  const targetId = item[field];
  if (!targetId) return;

  const idStr = String(targetId._id || targetId);

  if (field === 'postedBy' || field === 'claimedBy' || field === 'claimant' || field === 'recipient' || field === 'sender') {
    const user = data.users.find((u) => u._id === idStr);
    if (user) {
      item[field] = filterSelected(user, select);
    }
  } else if (field === 'item') {
    const itm = data.items.find((i) => i._id === idStr);
    if (itm) {
      item[field] = filterSelected(itm, select);
    }
  } else if (field === 'claim') {
    const clm = data.claims.find((c) => c._id === idStr);
    if (clm) {
      item[field] = filterSelected(clm, select);
    }
  }
}

function filterSelected(doc, selectStr) {
  if (!doc) return null;
  const cloned = JSON.parse(JSON.stringify(doc));
  if (!selectStr) return cloned;

  const fields = selectStr.split(' ').map((s) => s.trim()).filter(Boolean);
  const isExclusive = fields.every((f) => f.startsWith('-'));

  if (isExclusive) {
    for (let f of fields) {
      delete cloned[f.substring(1)];
    }
    return cloned;
  } else {
    const result = { _id: cloned._id };
    for (let f of fields) {
      result[f] = cloned[f];
    }
    return result;
  }
}

// Wrap plain object with mongoose-like document methods (.save(), .deleteOne(), .matchPassword(), .toObject())
function wrapDocument(doc, collectionName) {
  if (!doc) return null;

  const wrapper = {
    ...doc,
    toObject() {
      const obj = { ...this };
      delete obj.save;
      delete obj.deleteOne;
      delete obj.matchPassword;
      delete obj.toObject;
      return obj;
    },
    async save() {
      const col = data[collectionName];
      this.updatedAt = new Date().toISOString();

      if (collectionName === 'users' && this.isPasswordModified) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        this.isPasswordModified = false;
      }

      const idx = col.findIndex((d) => d._id === this._id);
      const cleanDoc = this.toObject();

      if (idx >= 0) {
        col[idx] = cleanDoc;
      } else {
        col.push(cleanDoc);
      }
      saveDB();
      return wrapDocument(cleanDoc, collectionName);
    },
    async deleteOne() {
      const col = data[collectionName];
      const idx = col.findIndex((d) => d._id === this._id);
      if (idx >= 0) {
        col.splice(idx, 1);
        saveDB();
      }
      return { acknowledged: true, deletedCount: 1 };
    },
  };

  if (collectionName === 'users') {
    wrapper.matchPassword = async function (enteredPassword) {
      return await bcrypt.compare(enteredPassword, this.password);
    };
  }

  return wrapper;
}

// Initialize on module load
loadDB();

// Collection Model Factories
function createModel(collectionName) {
  return {
    find(query = {}) {
      return new QueryBuilder(collectionName, query);
    },

    findOne(query = {}) {
      const qb = new QueryBuilder(collectionName, query);
      const originalExec = qb.exec.bind(qb);
      qb.exec = async () => {
        const list = await originalExec();
        return list.length > 0 ? list[0] : null;
      };
      return qb;
    },

    findById(id) {
      const qb = new QueryBuilder(collectionName, { _id: String(id) });
      const originalExec = qb.exec.bind(qb);
      qb.exec = async () => {
        const list = await originalExec();
        return list.length > 0 ? list[0] : null;
      };
      return qb;
    },

    async create(docData) {
      const col = data[collectionName];
      const nowStr = new Date().toISOString();

      let newDoc = {
        _id: docData._id || generateId(),
        ...docData,
        createdAt: docData.createdAt || nowStr,
        updatedAt: docData.updatedAt || nowStr,
      };

      if (collectionName === 'users') {
        const salt = await bcrypt.genSalt(10);
        newDoc.password = await bcrypt.hash(newDoc.password, salt);
      }

      if (Array.isArray(docData)) {
        const createdDocs = [];
        for (let d of docData) {
          const single = {
            _id: d._id || generateId(),
            ...d,
            createdAt: d.createdAt || nowStr,
            updatedAt: d.updatedAt || nowStr,
          };
          if (collectionName === 'users') {
            const s = await bcrypt.genSalt(10);
            single.password = await bcrypt.hash(single.password, s);
          }
          col.push(single);
          createdDocs.push(wrapDocument(single, collectionName));
        }
        saveDB();
        return createdDocs;
      }

      col.push(newDoc);
      saveDB();
      return wrapDocument(newDoc, collectionName);
    },

    async countDocuments(query = {}) {
      const list = (data[collectionName] || []).filter((doc) => matchesQuery(doc, query));
      return list.length;
    },

    async deleteOne(query = {}) {
      const col = data[collectionName];
      const idx = col.findIndex((doc) => matchesQuery(doc, query));
      if (idx >= 0) {
        col.splice(idx, 1);
        saveDB();
        return { acknowledged: true, deletedCount: 1 };
      }
      return { acknowledged: true, deletedCount: 0 };
    },

    async deleteMany(query = {}) {
      const col = data[collectionName];
      const initialLength = col.length;
      data[collectionName] = col.filter((doc) => !matchesQuery(doc, query));
      const deletedCount = initialLength - data[collectionName].length;
      if (deletedCount > 0) {
        saveDB();
      }
      return { acknowledged: true, deletedCount };
    },

    async updateMany(query = {}, update = {}) {
      const col = data[collectionName];
      let updatedCount = 0;

      for (let doc of col) {
        if (matchesQuery(doc, query)) {
          if (update.$set) {
            Object.assign(doc, update.$set);
          }
          doc.updatedAt = new Date().toISOString();
          updatedCount++;
        }
      }

      if (updatedCount > 0) {
        saveDB();
      }
      return { acknowledged: true, modifiedCount: updatedCount };
    },
  };
}

module.exports = {
  User: createModel('users'),
  Item: createModel('items'),
  Claim: createModel('claims'),
  Notification: createModel('notifications'),
  resetDB: () => {
    data = getInitialSeedData();
    saveDB();
  },
};
