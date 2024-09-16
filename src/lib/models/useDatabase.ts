import chalk from 'chalk';
import { v4 as uuidv4 } from 'uuid';
import pkg from 'pg';
const { Client } = pkg;

let client = null;

export const useDatabase = () => {
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
				chalk.magenta('[database:INFO]:'),
				'Current time from postgreSQL server:',
				result.rows[0]
			);
		} catch (error) {
			console.error(
				chalk.red('[database:ERROR]:'),
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
			console.error(chalk.magenta('[database:INFO]:'), 'Error saving user data:', error);
		}
	};

	const saveBuybackRequest = async (buybackRequestData) => {
		// if we are missing a UUID, this is new and we want to make one
		if (buybackRequestData.id === undefined) {
			buybackRequestData.id = uuidv4();
		}

		const saveBuybackRequestQuery = `
      INSERT INTO buyback_requests (user_id, id, contract_id, items, total_price, state, created_at, updated_at)
			VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
			ON CONFLICT (id)
			DO UPDATE SET
				state = $6,
				updated_at = NOW();
		`;

		try {
			await client.query(saveBuybackRequestQuery, [
				buybackRequestData.userId,
				buybackRequestData.id,
				buybackRequestData.contractId,
				JSON.stringify(buybackRequestData.items),
				buybackRequestData.total,
				buybackRequestData.state
			]);
		} catch (error) {
			console.error(chalk.magenta('[database:INFO]:'), 'Error saving buyback request:', error);
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
			console.error(chalk.magenta('[database:INFO]:'), 'Error getting user data:', error);
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
			console.error(chalk.magenta('[database:INFO]:'), 'Error getting user data:', error);
		}
	};

	const getBuybackRequests = async (eveId) => {
		const getBuybackRequestsQuery = `
      SELECT * FROM buyback_requests
      WHERE user_id = $1
			ORDER BY created_at DESC;
    `;

		try {
			const result = await client.query(getBuybackRequestsQuery, [eveId]);
			const rows = result.rows;
			return rows;
		} catch (error) {
			console.error(chalk.magenta('[database:INFO]:'), 'Error getting buyback requests:', error);
		}
	};

	const getAllBuybackRequests = async () => {
		const getBuybackRequestsQuery = `
			SELECT * FROM buyback_requests
			ORDER BY created_at DESC;
		`;

		try {
			const result = await client.query(getBuybackRequestsQuery);
			const rows = result.rows;
			return rows;
		} catch (error) {
			console.error(chalk.magenta('[database:INFO]:'), 'Error getting buyback requests:', error);
		}
	};

	const savePriceEntry = async (priceEntryData) => {
		const savePriceEntryQuery = `
			INSERT INTO price_entries (item_id, category_id, name, type, percentage, direction)
			VALUES ($1, $2, $3, $4, $5, $6)
			ON CONFLICT (item_id)
			DO UPDATE SET
				category_id = $2,
				name = $3,
				type = $4,
				percentage = $5,
				direction = $6;
		`;

		try {
			await client.query(savePriceEntryQuery, [
				priceEntryData.itemId,
				priceEntryData.categoryId,
				priceEntryData.name,
				priceEntryData.type,
				priceEntryData.percentage,
				priceEntryData.direction
			]);
		} catch (error) {
			console.error(chalk.magenta('[database:INFO]:'), 'Error saving price entry:', error);
		}
	};

	const getPriceEntryByItemTypeId = async (itemTypeId) => {
		const getPriceEntryQuery = `
			SELECT * FROM price_entries
			WHERE item_type_id = $1;
		`;

		try {
			const result = await client.query(getPriceEntryQuery, [itemTypeId]);
			return result;
		} catch (error) {
			console.error(chalk.magenta('[database:INFO]:'), 'Error getting price entry:', error);
		}
	};

	const getPriceEntryByMarketGroupId = async (marketGroupId) => {
		const getPriceEntryQuery = `
			SELECT * FROM price_entries
			WHERE market_group_id = $1;
		`;

		try {
			const result = await client.query(getPriceEntryQuery, [marketGroupId]);
			return result;
		} catch (error) {
			console.error(chalk.magenta('[database:INFO]:'), 'Error getting price entry:', error);
		}
	};

	const getPriceEntries = async () => {
		const getPriceEntriesQuery = `
			SELECT * FROM price_entries;
		`;

		try {
			const result = await client.query(getPriceEntriesQuery);
			return result;
		} catch (error) {
			console.error(chalk.magenta('[database:INFO]:'), 'Error getting price entries:', error);
		}
	};

	return {
		setup,
		saveUser,
		getUserData,
		getUserDataBySessionId,
		getBuybackRequests,
		getAllBuybackRequests,
		saveBuybackRequest,
		getPriceEntryByItemTypeId,
		getPriceEntryByMarketGroupId
	};
};
