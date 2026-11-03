// Verify service with real database
// Note: Code may not run !! 

const repository = new PgRegistrationRepository(pool);

const service = new RegistrationService(repository);

const result = await service.register('S001', 'E001');

console.log(result);
