const fetchData = async () => {
  const ownerId = 3; // Assuming the owner ID is 3

  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  };

  try {
    // Fetch owner details and cars owned by the owner concurrently
    const [ownerRes, carRes] = await Promise.all([
      fetch(`http://localhost:8080/owner/${ownerId}`, requestOptions),
      fetch(`http://localhost:8080/carsOwnedBy?ownerid=${ownerId}`, requestOptions),
    ]);

    // Check if responses are successful
    if (!ownerRes.ok) throw new Error('Failed to fetch owner details');
    if (!carRes.ok) throw new Error('Failed to fetch cars owned');

    // Parse JSON responses
    const owner = await ownerRes.json();
    const cars = await carRes.json();

    // Process and set state with the fetched data
    setOwner({
      firstName: owner.firstname,
      lastName: owner.lastname,
    });
    setCar(cars.map(car => ({
      brand: car.brand,
      model: car.model,
      makeYear: car.makeYear,
      price: car.price,
    })));

  } catch (error) {
    console.error('Error fetching data:', error);
  }
};