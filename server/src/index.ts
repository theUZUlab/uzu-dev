import { env } from './config/env';
import { connectDB } from './lib/db';
import { createServer } from './server';

async function main() {
    await connectDB();
    const app = createServer();
    app.listen(env.PORT, () => {
        console.log(`uzu-dev-backend listening on :${env.PORT}`);
    });
}

main().catch((err) => {
    console.error('Fatal startup error:', err);
    process.exit(1);
});
