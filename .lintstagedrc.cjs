module.exports = {
	"*": ["npm run prettier:fix"],
	"*.{ts,tsx}": ["npm run lint"]
};
