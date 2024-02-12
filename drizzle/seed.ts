console.log('🚀 Starting seeding...');

seed()
	.then(() => {
		console.log('✅ Seeding complete!');
		process.exit(0);
	})
	.catch((err) => {
		console.error('🚨 Seeding failed! Error:', err);
		process.exit(1);
	});

async function seed() {}
