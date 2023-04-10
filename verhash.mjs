import {promises as fs} from 'fs';
import {exec} from 'child_process';
import {promisify} from 'util';

const run = promisify(exec);

async function updatePackageVersion() {
	const packageJson = JSON.parse(await fs.readFile('./package.json', 'utf-8'));

	if (process.env.VERHASH_NYA !== '0w0') {
		throw new Error(`ENV(VERHASH_NYA) required for use has not been detected. Please set the value of ENV(VERHASH_NYA) to "0w0".`);
	}

	const {stdout: commitHash} = await run('git rev-parse --short=7 HEAD');
	console.log(`Detected commit hash: ${commitHash.trim()}`);

	const version       = `${packageJson.version}+cs-${commitHash.trim()}`;
	packageJson.version = version;

	await fs.writeFile('./package.json', JSON.stringify(packageJson, null, 2));
}

updatePackageVersion().catch((error) => {
	console.error(error);
	process.exit(1);
});
