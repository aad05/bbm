const filterViaObject = ({ object, keys, parse_keys = [] }) => {
	for (let i = 0; i < keys.length; i++) delete object[keys[i]];

	for (let i = 0; i < parse_keys.length; i++)
		if (object[parse_keys[i]])
			object[String(parse_keys[i])] = JSON.parse(object[String(parse_keys[i])]);

	return object;
};

module.exports = { filterViaObject };
