// Product data for The Happy Oven
export const products = [
  {
    id: 1,
    name: "Belgian Coverture Chocolate Cake",
    description: "This cake is a genuine indulgence, with layers of our moist dark chocolate sponge and Belgian Chocolate cream. To add the perfect finishing touch, it is topped with a luscious premium Belgian chocolate ganache.",
    // Explicit pricing (does NOT need to be half of 1kg)
    prices: { '0.5': 920, '1': 1700 },
    price: 1700, // keep for backward compatibility (1kg)
    image: "/images/products/belgian-coverture-chocolate-cake.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=900&fit=crop"
  },
  {
    id: 2,
    name: "Chocolate Fudge Cake (Coverture)",
    description: "Chocolate fudge cake is a rich, moist, and intensely chocolatey dessert often featuring layers of dense, dark chocolate cake covered in a velvety ganache or frosting. Unlike a standard chocolate sponge, a \"fudge\" cake is characterized by its high-fat content and dense texture.",
    prices: { '0.5': 880, '1': 1650 },
    price: 1650,
    image: "/images/products/chocolate-fudge-coverture.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=900&fit=crop"
  },
  {
    id: 3,
    name: "Red Velvet Cake",
    description: "Red velvet cake has a unique, subtle flavor that's a mix of mild cocoa, vanilla, and a slight tanginess from buttermilk and vinegar, creating a taste profile between yellow and chocolate cake, often enhanced by sweet, tangy cream cheese frosting. It's known for its tender, velvety texture and vibrant red color.",
    prices: { '0.5': 850, '1': 1600 },
    price: 1600,
    image: "/images/products/red-velvet-cake.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=900&fit=crop"
  },
  {
    id: 4,
    name: "Butter Cake with Chocolate Chips",
    description: "A butter cake with chocolate chips is a rich, tender, and moist cake, often featuring a cloud-like crumb.",
    prices: { '0.5': 750, '1': 1400 },
    price: 1400,
    image: "/images/products/butter-cake-chocolate-chips.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=900&fit=crop"
  },
  {
    id: 5,
    name: "Pineapple Upside-Down Cake",
    description: "Pineapple upside-down cake is a classic, nostalgic American dessert known for its caramelized topping of pineapple rings and maraschino cherries, revealed by flipping the cake over after baking. The cake itself is typically a moist, dense butter or yellow cake that absorbs the sugary fruit juices.",
    prices: { '0.5': 750, '1': 1350 },
    price: 1350,
    image: "/images/products/pineapple-upside-down-cake.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=900&fit=crop"
  },
  {
    id: 6,
    name: "Mawa Tea Cake",
    description: "Mawa tea cakes are a rich, dense, and moist Indian ghee cake. They are characterized by the use of mawa (khoya or solidified milk solids), which gives them a caramel-like, decadent flavor, and are often scented with cardamom.",
    prices: { '0.5': 650, '1': 1100 },
    price: 1100,
    image: "/images/products/mawa-tea-cake.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=900&fit=crop"
  },
  {
    id: 7,
    name: "Tres Leches",
    description: "Traditional three-milk cake, moist and creamy",
    price: 620,
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop"
  },
  {
    id: 8,
    name: "Muffins",
    type: "piece",
    unit: "piece",
    minOrderQuantity: 6,
    description: "Soft and fluffy muffins, available in various flavors. Price varies by flavour.",
    price: 55,
    priceMax: 65,
    image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400&h=400&fit=crop"
  },
  {
    id: 9,
    name: "Cupcakes",
    type: "piece",
    unit: "piece",
    minOrderQuantity: 4,
    description: "Delicious cupcakes with creamy frosting, perfect for any occasion. Price varies by design/flavour.",
    price: 60,
    priceMax: 75,
    image: "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=400&h=400&fit=crop"
  }
];

