const express = require('express');
const router = express.Router();

// Handle get and post requests here

const getAddresses = async (req, res) => {
  const postcode = req.body.postcode;
  if (!postcode) {
    res.render('../views/index.njk', { error: 'Invalid Request, please send a valid search query' });
    return;
  }
  const url = `https://api.os.uk/search/names/v1/find?key=Xi0Px2KXSPHlwu1AD6FLR8kWJMgAoQQu&query=${postcode}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    const addresses = data.results.map((address) => {
      return {
        id: address.GAZETTEER_ENTRY.ID,
        name: address.GAZETTEER_ENTRY.NAME1,
        populatedPlace: address.GAZETTEER_ENTRY.POPULATED_PLACE,
        countyUnitary: address.GAZETTEER_ENTRY.COUNTY_UNITARY,
        region: address.GAZETTEER_ENTRY.REGION,
        country: address.GAZETTEER_ENTRY.COUNTRY
      };
    });
    res.render('../views/addresses.njk', { addresses, postcode });
  } catch (error) {
    res.render('../views/index.njk', { error: 'Error fetching data from Address API, please try again' });
    return;
  }
}

router.post('/addresses', getAddresses);

module.exports = {
  addressesRouter: router,
  getAddresses
};