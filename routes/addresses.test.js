const { getAddresses } = require('./addresses');

describe('getAddresses', () => {
  test('should render index.njk with error message if no postcode is provided', async () => {
    const req = {
      body: {
        postcode: ''
      }
    };
    const res = {
      render: jest.fn()
    };

    await getAddresses(req, res);

    expect(res.render).toHaveBeenCalledWith('../views/index.njk', {
      error: 'Invalid Request, please send a valid search query'
    });
  });

  test('should render index.njk with error message if there is an error fetching data', async () => {
    const req = {
      body: {
        postcode: 'SW1A 1AA'
      }
    };
    const res = {
      render: jest.fn()
    };

    const mockResponse = { json: jest.fn().mockRejectedValue(new Error('Error fetching data')) };
    jest.spyOn(global, 'fetch').mockResolvedValue(mockResponse);

    await getAddresses(req, res);

    expect(fetch).toHaveBeenCalledWith('https://api.os.uk/search/names/v1/find?key=Xi0Px2KXSPHlwu1AD6FLR8kWJMgAoQQu&query=SW1A 1AA');
    expect(res.render).toHaveBeenCalledWith('../views/index.njk', {
      error: 'Error fetching data from Address API, please try again'
    });
  });

  test('should render addresses.njk with addresses and postcode', async () => {
    const req = {
      body: {
        postcode: 'SW1A 1AA'
      }
    };
    const res = {
      render: jest.fn()
    };
    const data = {
      results: [
        {
          GAZETTEER_ENTRY: {
            ID: 1,
            NAME1: 'Address 1',
            POPULATED_PLACE: 'City 1',
            COUNTY_UNITARY: 'County 1',
            REGION: 'Region 1',
            COUNTRY: 'Country 1'
          }
        },
        {
          GAZETTEER_ENTRY: {
            ID: 2,
            NAME1: 'Address 2',
            POPULATED_PLACE: 'City 2',
            COUNTY_UNITARY: 'County 2',
            REGION: 'Region 2',
            COUNTRY: 'Country 2'
          }
        }
      ]
    };
    const expectedAddresses = [
      {
        id: 1,
        name: 'Address 1',
        populatedPlace: 'City 1',
        countyUnitary: 'County 1',
        region: 'Region 1',
        country: 'Country 1'
      },
      {
        id: 2,
        name: 'Address 2',
        populatedPlace: 'City 2',
        countyUnitary: 'County 2',
        region: 'Region 2',
        country: 'Country 2'
      }
    ];
    const mockResponse = { json: jest.fn().mockResolvedValue(data) };
    jest.spyOn(global, 'fetch').mockResolvedValue(mockResponse);

    await getAddresses(req, res);

    expect(fetch).toHaveBeenCalledWith('https://api.os.uk/search/names/v1/find?key=Xi0Px2KXSPHlwu1AD6FLR8kWJMgAoQQu&query=SW1A 1AA');
    expect(res.render).toHaveBeenCalledWith('../views/addresses.njk', { addresses: expectedAddresses, postcode: 'SW1A 1AA' });
  });
});