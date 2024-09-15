// This interfaces with our postgreSQL Timescale database codename Birdhouse
import chalk from 'chalk';
import pkg from 'pg';
const { Client } = pkg;

let client = null;

export const BIRDHOUSE_DOSSIER_TYPES = {
	player: 'player',
	character: 'character',
	corporation: 'corporation',
	alliance: 'alliance'
};

export const useBirdhouse = () => {
	const setup = async () => {
		client = new Client({
			host: process.env.PGHOST,
			port: process.env.PGPORT,
			user: process.env.PGUSER,
			password: process.env.PGPASSWORD,
			database: process.env.PGDATABASE
		});

		try {
			await client.connect();

			const result = await client.query('SELECT NOW()');
			console.log(
				chalk.magenta('[birdhouse:INFO]:'),
				'Current time from postgreSQL server:',
				result.rows[0]
			);
		} catch (error) {
			console.error(
				chalk.red('[birdhouse:ERROR]:'),
				'Error connecting to postgreSQL server:',
				error
			);
		}
	};

	const saveUser = async (userData) => {
		// we design this to either update or insert a user
		const saveUserQuery = `
      INSERT INTO users (id, name, access_token, refresh_token, session_id)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (id)
      DO UPDATE SET
        name = $2,
        access_token = $3,
        refresh_token = $4,
        session_id = $5;
    `;

		try {
			await client.query(saveUserQuery, [
				userData.id,
				userData.name,
				userData.access_token,
				userData.refresh_token,
				userData.sessionId
			]);
		} catch (error) {
			console.error(chalk.magenta('[birdhouse:INFO]:'), 'Error saving user data:', error);
		}
	};

	const saveBuybackRequest = async (buybackRequestData) => {
		const saveBuybackRequestQuery = `
      INSERT INTO buyback_requests (character_eve_id, character_name, corporation_eve_id, corporation_name, alliance_eve_id, alliance_name, ship_type_id, ship_name, ship_value, ship_fit, contract_id, contract_url, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW());
    `;

		try {
			await client.query(saveBuybackRequestQuery, [
				buybackRequestData.characterEveId,
				buybackRequestData.characterName,
				buybackRequestData.corporationEveId,
				buybackRequestData.allianceEveId,
				buybackRequestData.contractId,
				buybackRequestData.items,
				buybackRequestData.totalValue
			]);
		} catch (error) {
			console.error(chalk.magenta('[birdhouse:INFO]:'), 'Error saving buyback request:', error);
		}
	};

	const getUserData = async (userId) => {
		// we only want to get the name, id, session ID, and admin bool
		const getUserQuery = `
      SELECT id, name, session_id, admin FROM users
      WHERE id = $1;
    `;

		try {
			const result = await client.query(getUserQuery, [userId]);
			return result;
		} catch (error) {
			console.error(chalk.magenta('[birdhouse:INFO]:'), 'Error getting user data:', error);
		}
	};

	const getUserDataBySessionId = async (sessionId) => {
		// we only want to get the name, id, session ID, and admin bool
		const getUserQuery = `
      SELECT id, name, session_id, admin FROM users
      WHERE session_id = $1;
    `;

		try {
			const result = await client.query(getUserQuery, [sessionId]);
			return result;
		} catch (error) {
			console.error(chalk.magenta('[birdhouse:INFO]:'), 'Error getting user data:', error);
		}
	};

	const getBuybackRequests = async (eveId) => {
		const getBuybackRequestsQuery = `
      SELECT * FROM buyback_requests
      WHERE character_eve_id = $1;
    `;

		try {
			const result = await client.query(getBuybackRequestsQuery, [eveId]);
			const rows = result.rows;
			return rows;
		} catch (error) {
			console.error(chalk.magenta('[birdhouse:INFO]:'), 'Error getting buyback requests:', error);
		}
	};

	return {
		setup,
		saveUser,
		getUserData,
		getUserDataBySessionId
	};
};
