const randomChar = () => {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
	return chars.charAt(Math.floor(Math.random() * chars.length));
};

export const startRandomizing = (textElement, interval = 100) => {
	let charsArray = [...textElement.textContent]; // Initial array of characters

	function randomize() {
		// Pick a random position to change
		const randomIndex = Math.floor(Math.random() * charsArray.length);

		// Replace the character at randomIndex with a new random character
		charsArray[randomIndex] = randomChar();

		// Update the element text with the modified array
		textElement.textContent = charsArray.join('');
	}

	setInterval(randomize, interval);
};