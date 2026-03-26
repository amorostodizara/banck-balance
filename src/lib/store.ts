// Simulates MySQL database with triggers using localStorage

export interface Client {
  num_compte: number;
  nomclient: string;
  solde: number;
}

export interface Versement {
  num_versement: number;
  num_cheque: number;
  num_compte: number;
  montant: number;
  action_by: string;
}

export interface AuditVersement {
  id: number;
  type_action: "INSERT" | "UPDATE" | "DELETE";
  date_operation: string;
  num_versement: number;
  num_compte: number;
  nomclient: string;
  montant_ancien: number;
  montant_nouv: number;
  users: string;
}

export interface User {
  id: number;
  name: string;
  username: string;
  password: string;
}

const KEYS = {
  clients: "banque_clients",
  versements: "banque_versements",
  audits: "banque_audits",
  users: "banque_users",
  counters: "banque_counters",
};

interface Counters {
  client: number;
  versement: number;
  cheque: number;
  audit: number;
}

function load<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : fallback;
}

function save<T>(key: string, data: T) {
  localStorage.setItem(key, JSON.stringify(data));
}

function initIfNeeded() {
  if (localStorage.getItem(KEYS.users)) return;

  const users: User[] = [
    { id: 1, name: "Jean Dupont", username: "admin", password: "1234" },
    { id: 2, name: "Marie Rakoto", username: "admin", password: "2345" },
    { id: 3, name: "Paul Martin", username: "viewer", password: "3456" },
    { id: 4, name: "Alice Bernard", username: "viewer", password: "4567" },
  ];

  const clients: Client[] = [
    { num_compte: 10, nomclient: "Rakoto", solde: 0 },
    { num_compte: 11, nomclient: "Rabe", solde: 0 },
    { num_compte: 12, nomclient: "Rasoa", solde: 0 },
  ];

  const counters: Counters = { client: 13, versement: 100, cheque: 109, audit: 1 };

  save(KEYS.users, users);
  save(KEYS.clients, clients);
  save(KEYS.versements, []);
  save(KEYS.audits, []);
  save(KEYS.counters, counters);
}

initIfNeeded();

// --- Users ---
export function authenticate(username: string, password: string): User | null {
  const users = load<User[]>(KEYS.users, []);
  return users.find((u) => u.username === username && u.password === password) || null;
}

// --- Clients ---
export function getClients(): Client[] {
  return load<Client[]>(KEYS.clients, []);
}

export function addClient(nomclient: string, solde: number = 0): Client {
  const clients = getClients();
  const counters = load<Counters>(KEYS.counters, { client: 13, versement: 100, cheque: 109, audit: 1 });
  const client: Client = { num_compte: counters.client++, nomclient, solde };
  clients.push(client);
  save(KEYS.clients, clients);
  save(KEYS.counters, counters);
  return client;
}

export function updateClient(num_compte: number, nomclient: string, solde: number) {
  const clients = getClients();
  const idx = clients.findIndex((c) => c.num_compte === num_compte);
  if (idx >= 0) {
    clients[idx] = { ...clients[idx], nomclient, solde };
    save(KEYS.clients, clients);
  }
}

export function deleteClient(num_compte: number) {
  const clients = getClients().filter((c) => c.num_compte !== num_compte);
  save(KEYS.clients, clients);
}

// --- Versements (with trigger simulation) ---
export function getVersements(): Versement[] {
  return load<Versement[]>(KEYS.versements, []);
}

export function addVersement(num_compte: number, montant: number, action_by: string): Versement {
  const versements = getVersements();
  const clients = getClients();
  const counters = load<Counters>(KEYS.counters, { client: 13, versement: 100, cheque: 109, audit: 1 });

  // before_insert trigger: auto-generate num_cheque
  const num_cheque = ++counters.cheque;
  const num_versement = counters.versement++;

  const versement: Versement = { num_versement, num_cheque, num_compte, montant, action_by };
  versements.push(versement);

  // after_insert trigger: get ancien_montant
  const previousVersements = versements
    .filter((v) => v.num_compte === num_compte && v.num_versement < num_versement)
    .sort((a, b) => b.num_versement - a.num_versement);
  const ancien_montant = previousVersements.length > 0 ? previousVersements[0].montant : 0;

  // Update client solde
  const clientIdx = clients.findIndex((c) => c.num_compte === num_compte);
  if (clientIdx >= 0) {
    clients[clientIdx].solde += montant;
  }

  // Insert audit
  const audits = load<AuditVersement[]>(KEYS.audits, []);
  const client = clients.find((c) => c.num_compte === num_compte);
  audits.push({
    id: counters.audit++,
    type_action: "INSERT",
    date_operation: new Date().toISOString(),
    num_versement,
    num_compte,
    nomclient: client?.nomclient || "",
    montant_ancien: ancien_montant,
    montant_nouv: montant,
    users: action_by,
  });

  save(KEYS.versements, versements);
  save(KEYS.clients, clients);
  save(KEYS.audits, audits);
  save(KEYS.counters, counters);
  return versement;
}

export function updateVersement(num_versement: number, montant: number, action_by: string) {
  const versements = getVersements();
  const clients = getClients();
  const counters = load<Counters>(KEYS.counters, { client: 13, versement: 100, cheque: 109, audit: 1 });
  const idx = versements.findIndex((v) => v.num_versement === num_versement);
  if (idx < 0) return;

  const old = versements[idx];
  const clientIdx = clients.findIndex((c) => c.num_compte === old.num_compte);
  if (clientIdx >= 0) {
    clients[clientIdx].solde += montant - old.montant;
  }

  versements[idx] = { ...old, montant, action_by };

  const audits = load<AuditVersement[]>(KEYS.audits, []);
  const client = clients.find((c) => c.num_compte === old.num_compte);
  audits.push({
    id: counters.audit++,
    type_action: "UPDATE",
    date_operation: new Date().toISOString(),
    num_versement,
    num_compte: old.num_compte,
    nomclient: client?.nomclient || "",
    montant_ancien: old.montant,
    montant_nouv: montant,
    users: action_by,
  });

  save(KEYS.versements, versements);
  save(KEYS.clients, clients);
  save(KEYS.audits, audits);
  save(KEYS.counters, counters);
}

export function deleteVersement(num_versement: number, action_by: string) {
  const versements = getVersements();
  const clients = getClients();
  const counters = load<Counters>(KEYS.counters, { client: 13, versement: 100, cheque: 109, audit: 1 });
  const idx = versements.findIndex((v) => v.num_versement === num_versement);
  if (idx < 0) return;

  const old = versements[idx];
  const clientIdx = clients.findIndex((c) => c.num_compte === old.num_compte);
  if (clientIdx >= 0) {
    clients[clientIdx].solde -= old.montant;
  }

  versements.splice(idx, 1);

  const audits = load<AuditVersement[]>(KEYS.audits, []);
  const client = clients.find((c) => c.num_compte === old.num_compte);
  audits.push({
    id: counters.audit++,
    type_action: "DELETE",
    date_operation: new Date().toISOString(),
    num_versement: old.num_versement,
    num_compte: old.num_compte,
    nomclient: client?.nomclient || "",
    montant_ancien: old.montant,
    montant_nouv: 0,
    users: action_by,
  });

  save(KEYS.versements, versements);
  save(KEYS.clients, clients);
  save(KEYS.audits, audits);
  save(KEYS.counters, counters);
}

// --- Audit ---
export function getAudits(): AuditVersement[] {
  return load<AuditVersement[]>(KEYS.audits, []);
}
