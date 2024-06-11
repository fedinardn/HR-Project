import * as db from "../services/database.mjs"


describe("Database Functions", () => {
  afterEach(async () => {
    // Clear database after each test
    await db.clear();
  });

  fit("should create a new client", async () => {
    // Create a new client
    const newClient = await createClient({
      companyName: "ABC Inc.",
      contactPerson: "John Doe"
    });

    // Retrieve all clients from the database
    const clients = await getAllClients();

    // Assert that a client was created and stored correctly
    expect(clients.length).toEqual(1);
    expect(clients[0]).toEqual(jasmine.objectContaining({
      id: newClient.id,
      companyName: "ABC Inc.",
      contactPerson: "John Doe"
    }));
  });

  it("should create a new program for a client", async () => {
    // Create a new client
    const newClient = await createClient({
      companyName: "XYZ Corp.",
      contactPerson: "Jane Smith"
    });

    // Create a new program for the client
    const newProgram = await createNewProgramForClient({
      clientId: newClient.id,
      programName: "Fitness Program",
      programTypes: ["Fitness", "Wellness"]
    });

    // Retrieve all programs for the client
    const programs = await getAllProgramsForClient({ clientId: newClient.id });

    // Assert that a program was created and stored correctly
    expect(programs.length).toEqual(1);
    expect(programs[0]).toEqual(jasmine.objectContaining({
      id: newProgram.id,
      programName: "Fitness Program",
      programTypes: ["Fitness", "Wellness"]
    }));
  });

  it("should throw an error when client ID is invalid", async () => {
    // Attempt to create a program for a non-existent client
    const invalidClientId = "invalidId";

    // Expect createNewProgramForClient to throw an error when client ID is invalid
    await expectAsync(createNewProgramForClient({
      clientId: invalidClientId,
      programName: "Fitness Program",
      programTypes: ["Fitness", "Wellness"]
    })).toBeRejectedWithError(`Client with ID ${invalidClientId} not found`);
  });
});

// Mock database functions for testing purposes
const mockDatabase = {
  clients: [],
  async clear() {
    this.clients = [];
  },
  async getAllClients() {
    return this.clients;
  },
  async createClient({ companyName, contactPerson }) {
    const newClient = {
      id: crypto.randomUUID(),
      companyName: companyName,
      contactPerson: contactPerson,
      createdAt: Date.now(),
      programs: []
    };
    this.clients.push(newClient);
    return newClient;
  },
  async createNewProgramForClient({ clientId, programName, programTypes }) {
    const client = this.clients.find((client) => client.id === clientId);
    if (!client) {
      throw new Error(`Client with ID ${clientId} not found`);
    }
    const newProgram = {
      id: crypto.randomUUID(),
      programName: programName,
      programTypes: programTypes,
      price: 0, // Set default price or modify as needed
      assignedStaff: [],
      approved: false
    };
    client.programs.push(newProgram);
    return newProgram;
  },
  async getAllProgramsForClient({ clientId }) {
    const client = this.clients.find((client) => client.id === clientId);
    return client ? client.programs : [];
  }
};

// Helper function to clear the mock database
async function clearDatabase() {
  await mockDatabase.clear();
}

// Mocking openDb and saveData functions
const openDb = async () => mockDatabase;
const saveData = async (data) => { /* Mock save data logic */ };

// Use the mock database functions for testing
const { createClient, createNewProgramForClient, getAllProgramsForClient } = mockDatabase;
