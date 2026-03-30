package com.rg.ecom.seeder;

import com.rg.ecom.entity.auth.Role;
import com.rg.ecom.entity.auth.User;
import com.rg.ecom.entity.auth.UserRole;
import com.rg.ecom.entity.inventory.Inventory;
import com.rg.ecom.entity.order.MovementType;
import com.rg.ecom.entity.order.Order;
import com.rg.ecom.entity.order.OrderItem;
import com.rg.ecom.entity.order.OrderStatus;
import com.rg.ecom.entity.order.StockMovement;
import com.rg.ecom.entity.product.Category;
import com.rg.ecom.entity.product.Product;
import com.rg.ecom.entity.product.Supplier;
import com.rg.ecom.repository.CategoryRepository;
import com.rg.ecom.repository.InventoryRepository;
import com.rg.ecom.repository.OrderItemRepository;
import com.rg.ecom.repository.OrderRepository;
import com.rg.ecom.repository.ProductRepository;
import com.rg.ecom.repository.RoleRepository;
import com.rg.ecom.repository.StockMovementRepository;
import com.rg.ecom.repository.SupplierRepository;
import com.rg.ecom.repository.UserRepository;
import com.rg.ecom.repository.UserRoleRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class DataSeederService {

    private final SupplierRepository supplierRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;
    private final PasswordEncoder passwordEncoder;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final StockMovementRepository stockMovementRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public SeederResult seed() {
        List<Supplier> suppliers = createSuppliers();
        List<Category> categories = createCategories();
        int productCount = createProducts(categories, suppliers);

        entityManager.flush();
        entityManager.createNativeQuery("UPDATE products SET created_at = '2025-01-12 00:00:00'").executeUpdate();

        int ordersCreated = seedOrders();

        return new SeederResult(suppliers.size(), categories.size(), productCount, ordersCreated);
    }

    private List<Supplier> createSuppliers() {
        List<Supplier> suppliers = new ArrayList<>();

        String[][] supplierData = {
            {"Chennai Tech Distributors", "Arun Kumar",   "044-2345-6701", "arun@chentechdist.com",  "12, Ambattur Industrial Estate, Ambattur, Chennai - 600058"},
            {"Coromandel Traders",        "Devi Sundaram", "044-2345-6702", "devi@coromandeltr.com",  "34, Anna Salai, Teynampet, Chennai - 600018"},
            {"Marina Wholesale Hub",      "Kavi Rajan",   "044-2345-6703", "kavi@marinawholesale.com","56, NSC Bose Road, Parrys, Chennai - 600001"},
            {"Pallavan Supply Co.",       "Bala Murugan",  "044-2345-6704", "bala@pallavansupply.com", "78, SIDCO Industrial Estate, Guindy, Chennai - 600032"},
            {"Ponniyar Imports",          "Mani Kumar",   "044-2345-6705", "mani@ponniyarimp.com",    "90, Manali Industrial Area, Manali, Chennai - 600068"},
            {"Kaveri Trading Co.",        "Naga Venkat",  "044-2345-6706", "naga@kaveritrading.com",  "11, Old Mahabalipuram Road, Sholinganallur, Chennai - 600119"}
        };

        for (String[] data : supplierData) {
            Supplier supplier = Supplier.builder()
                    .name(data[0])
                    .contactPerson(data[1])
                    .phone(data[2])
                    .email(data[3])
                    .address(data[4])
                    .build();
            suppliers.add(supplierRepository.save(supplier));
        }

        return suppliers;
    }

    private List<Category> createCategories() {
        List<Category> categories = new ArrayList<>();

        String[][] categoryData = {
            {"Electronics",     "Devices, gadgets, and electronic components for everyday use"},
            {"Clothing",        "Men's, women's, and children's apparel and accessories"},
            {"Home & Garden",   "Furniture, decor, tools, and outdoor living essentials"},
            {"Sports & Fitness","Equipment, apparel, and accessories for sports and exercise"},
            {"Books & Media",   "Books, e-books, music, movies, and educational content"}
        };

        for (String[] data : categoryData) {
            Category category = Category.builder()
                    .name(data[0])
                    .description(data[1])
                    .build();
            categories.add(categoryRepository.save(category));
        }

        return categories;
    }

    private int createProducts(List<Category> categories, List<Supplier> suppliers) {
        // Each product: {name, description, price, imageUrl}
        String[][][] productData = {
            // Electronics - 15 products
            {
                {"Xiaomi Redmi Note 13 Smartphone",          "6.67\" AMOLED display, 108MP camera, 5000mAh battery",          "14999", "https://i.ibb.co/Zr0N0Py/71-VW8-Lmqq-PL.jpg"},
                {"Samsung Galaxy M34 5G Smartphone",         "6.5\" sAMOLED, 50MP triple camera, 6000mAh battery",            "18999", "https://i.ibb.co/Psw19Mty/91fonh-Ato-AL.jpg"},
                {"OnePlus Nord CE 3 Lite",                   "6.72\" LCD, 108MP camera, 67W SUPERVOOC fast charging",          "19999", "https://i.ibb.co/kgY5P4Pj/oneplus-nord-ce-3-lite-review-1.avif"},
                {"Sony WH-CH520 Wireless Headphones",        "Over-ear Bluetooth headphones with 50hr battery life",           "4490",  "https://i.ibb.co/m5VCTJNX/271047-15-xyikyv.webp"},
                {"Boat Rockerz 255 Pro+ Bluetooth Earphones","Neckband earphones with ASAP Charge and 40hr playback",          "999",   "https://i.ibb.co/kggpT81F/252117-8-bpkdrg.webp"},
                {"Realme Buds Air 5 Pro",                    "True wireless earbuds with 50dB ANC and 38hr battery",           "3999",  "https://i.ibb.co/7JSbhVYv/9-6-scaled.webp"},
                {"LG 43\" 4K UHD Smart TV",                  "43-inch webOS smart TV with Dolby Vision and HDR10",             "35990", "https://i.ibb.co/TBYqYY1r/LG-43-4-K-UHD-Smart-TV-2160p-web-OS-43-UQ7070-ZUD-1fca7464-feba-4fe7-83c5-f6dd1ee29a6c-4dbf4050a4fbb735.jpg"},
                {"Samsung 55\" Crystal UHD Smart TV",        "55-inch 4K Crystal UHD with PurColor and Tizen OS",              "54990", "https://i.ibb.co/kgd6TNqm/81z9-MIj7z-HL.jpg"},
                {"Dell Inspiron 15 Laptop",                  "Intel Core i5, 8GB RAM, 512GB SSD, Windows 11",                  "54990", "https://i.ibb.co/ZR6GXjvD/306647-0-cdu0nd.webp"},
                {"HP Pavilion Gaming Laptop",                "AMD Ryzen 5, RTX 3050, 16GB RAM, 512GB SSD",                     "79990", "https://i.ibb.co/5hTk8MDR/img-8327.jpg"},
                {"Logitech MK215 Wireless Keyboard & Mouse", "Compact wireless keyboard and mouse combo, 24-month battery",    "1595",  "https://i.ibb.co/bg30dv2T/71ic-SLl-BIv-L.jpg"},
                {"Amazon Echo Dot 5th Gen Smart Speaker",    "Compact smart speaker with Alexa, improved audio and temp sensor","4499", "https://i.ibb.co/ym7xQWHL/amazon-echo-dot-hero.avif"},
                {"Mi 20000mAh Power Bank",                   "Dual output USB-A + USB-C, 18W fast charging power bank",        "1299",  "https://i.ibb.co/tPYcdLnF/Pf2is-Vq72ibun-Ed-C8-B5-Cg-R.jpg"},
                {"Canon EOS 1500D DSLR Camera",              "24.1MP APS-C sensor, Wi-Fi, NFC, Full HD video recording",       "34990", "https://i.ibb.co/yF30JjxB/267969-1-afxfl7.webp"},
                {"SanDisk Ultra 128GB MicroSD Card",         "Class 10 microSD with up to 140MB/s read speed",                 "799",   "https://i.ibb.co/TBwcH8Ys/sandisk-ultra-128gb-microsdxc-uhs-i-card-for-smart-phones-ultra-card-class10-product-images-orvft91eb.jpg"}
            },
            // Clothing - 9 products (6 removed: no image URL)
            {
                {"Peter England Men's Formal Shirt",         "100% cotton formal shirt, slim fit, solid colours",              "999",   "https://i.ibb.co/vCw0rmyN/peter-england-mens-regular-fit-shirt-original-imagszygr5zjnr7m.jpg"},
                {"Raymond Men's Slim Fit Trousers",          "Premium wool-blend slim fit formal trousers",                    "2499",  "https://i.ibb.co/HTLqNBdB/raymond-slim-fit-trousers-original-imafge4h2gr3gzxa.jpg"},
                {"Levi's Men's 511 Slim Jeans",              "Slim fit stretch denim jeans with signature Levi's finish",      "2999",  "https://i.ibb.co/Mk0CkYBB/levis-511-slim-fit-jeans-original-imagssd2g73jzn5q.jpg"},
                {"Allen Solly Men's Polo T-Shirt",           "Pique cotton polo shirt with embroidered logo",                  "899",   "https://i.ibb.co/xSFR0X4c/allen-solly-mens-polo-tshirt-original-imagsczggu7hgmg.jpg"},
                {"Manyavar Men's Wedding Sherwani",          "Jacquard silk sherwani with churidar for festive occasions",      "14999", "https://i.ibb.co/fYJLRGy6/MANY0724184-1.avif"},
                {"Van Heusen Men's Blazer",                  "Regular fit single-breasted blazer in premium polyester",         "3999",  "https://i.ibb.co/whJhSBXG/photoroom-000-20250610-093640.webp"},
                {"Puma Men's Sports T-Shirt",                "DryCELL moisture-wicking sports tee for training",                "699",   "https://i.ibb.co/rGFwxknM/d30a18968824175-1.avif"},
                {"Adidas Men's Track Pants",                 "Tricot slim-fit track pants with side stripes",                   "1999",  "https://i.ibb.co/fzkQr220/fe5a3d1c-5802-4529-ae70-3337da45f768.webp"},
                {"US Polo Assn Men's Casual Shirt",          "Cotton casual shirt with button-down collar and chest pocket",    "1299",  "https://i.ibb.co/PvBzhV1y/a5c156a-USSHT2527-H-1.avif"}
            },
            // Home & Garden - 15 products
            {
                {"Godrej Interio Wooden Wardrobe",           "3-door engineered wood wardrobe with mirror and shelves",         "25990", "https://i.ibb.co/3m6FbRRx/71-A3yg9w-A0-L.jpg"},
                {"Nilkamal Plastic Chair",                   "Sturdy plastic chair for indoor and outdoor use, stackable",      "1199",  "https://i.ibb.co/bwY82VR/ch-60.png"},
                {"IKEA Study Table",                         "Compact melamine-coated particleboard desk, 120x60 cm",           "7990",  "https://i.ibb.co/Txvz0bc8/WSTCAMUSWM-1.avif"},
                {"Wakefit Memory Foam Mattress",             "High-density memory foam mattress with breathable cover",         "14990", "https://i.ibb.co/jXrpXmF/91-GSVX6-QU3-L.jpg"},
                {"Usha Ceiling Fan",                         "3-blade 1200mm ceiling fan with high air delivery and sheen finish","2499","https://i.ibb.co/dJxR5tzy/1-e7d217fa-e655-4eca-a7ce-29002ba69518.webp"},
                {"Crompton Greaves Table Fan",               "400mm high-speed table fan with 3-speed motor control",           "1299",  "https://i.ibb.co/5W40j6SX/1763051473-39fdfc42.webp"},
                {"Philips LED Bulb 9W",                      "Pack of 4 energy-saving 9W LED bulbs, 6500K cool daylight",       "199",   "https://i.ibb.co/jPHqT7Yb/MP000000028154951-1348-Wx2000-H-2025090218054 91.webp"},
                {"Prestige Induction Cooktop",               "2000W induction cooktop with 8 preset menus and feather touch",   "2499",  "https://i.ibb.co/0RfkWP8R/81z6-Rfbu-Uc-L.jpg"},
                {"Milton Thermosteel Water Bottle",          "750ml stainless steel vacuum insulated bottle, 18hrs hot/cold",   "699",   "https://i.ibb.co/4RFys4VZ/Fame-800-760-ml-Black-2.webp"},
                {"Borosil Glass Storage Containers",         "Set of 3 borosilicate glass containers with airtight lids",       "1299",  "https://i.ibb.co/6JmpDsGm/313451-e3brha.webp"},
                {"Hawkins Pressure Cooker",                  "5-litre hard anodised aluminium pressure cooker with lid",        "1699",  "https://i.ibb.co/NgLdzGHB/MP000000008604483-1348-Wx2000-H-202101201354451.webp"},
                {"Pigeon Non-Stick Cookware Set",            "3-piece non-stick kadai, tawa, and sauce pan with lids",          "1899",  "https://i.ibb.co/qLc062P6/pigeon-nonstick-cookware-set.jpg"},
                {"Home Centre Cotton Bed Sheet Set",         "Double bed 144 TC cotton sheet with 2 pillow covers",             "1499",  "https://i.ibb.co/pvR3MzVP/home-centre-cotton-bed-sheet.jpg"},
                {"Kuber Industries Storage Organizer",       "6-shelf non-woven fabric wardrobe organizer with zip closure",    "799",   "https://i.ibb.co/XxWSzcYs/kuber-industries-storage-organizer.jpg"},
                {"Asian Paints Wall Paint Bucket",           "10L interior emulsion paint, washable and low VOC",               "2199",  "https://i.ibb.co/r1xS3CY/asian-paints-wall-paint-bucket.jpg"}
            },
            // Sports & Fitness - 15 products
            {
                {"Yonex GR 303 Badminton Racket",            "Aluminium shaft badminton racket for beginners and club play",    "499",   "https://i.ibb.co/KjV0cnn8/yonex-gr-303-badminton-racket.jpg"},
                {"Cosco Football Size 5",                    "32-panel machine-stitched PVC football, FIFA standard size 5",    "799",   "https://i.ibb.co/pvctJ0HZ/cosco-football-size-5.jpg"},
                {"Nivia Storm Football Shoes",               "TPU outsole football shoes with synthetic upper, non-marking",    "1499",  "https://i.ibb.co/99BsS0LG/nivia-storm-football-shoes.jpg"},
                {"SG Kashmir Willow Cricket Bat",            "Full-size Kashmir willow cricket bat with cane handle",           "1299",  "https://i.ibb.co/bM0fHj5X/sg-kashmir-willow-cricket-bat.jpg"},
                {"SS Cricket Batting Gloves",                "Full-finger foam-padded batting gloves for right-hand batsmen",   "799",   "https://i.ibb.co/6c2gSXS1/ss-cricket-batting-gloves.jpg"},
                {"Puma Running Shoes",                       "SOFTRIDE foam cushioned running shoes with mesh upper",            "3999",  "https://i.ibb.co/2371BYj9/Puma-Fast-R-3-Review.webp"},
                {"Adidas Yoga Mat",                          "6mm non-slip TPE yoga mat with carry strap",                     "1499",  "https://i.ibb.co/Zzpj7mZT/adidas-yoga-mat-8mm-mystery-ruby-product-images-orvhrfggc3q-p597716171-4-202301192123.jpg"},
                {"Decathlon Domyos Dumbbells 5kg Set",       "Pair of 5kg hex rubber dumbbells for home gym workouts",          "1499",  "https://i.ibb.co/kjRK413/p2743129.jpg"},
                {"HRX Fitness Tracker Watch",                "Bluetooth fitness band with heart rate, SpO2, and step tracking", "2999",  "https://i.ibb.co/qY4gL91N/043484b-HRXBounce-Active-Black-4.avif"},
                {"Strauss Skipping Rope",                    "Adjustable PVC skipping rope with foam handles",                  "299",   "https://i.ibb.co/fzkThBCZ/strauss-blue-wool-skipping-rope-product-images-orvgvyxvc0k-p600068439-0-202304011559.jpg"},
                {"Kobo Adjustable Hand Grip",                "Spring-loaded grip strengthener with adjustable resistance",       "399",   "https://i.ibb.co/RVv7ct0/p2096054.jpg"},
                {"Lifelong Exercise Cycle",                  "Magnetic resistance upright exercise bike with LCD display",       "9999",  "https://i.ibb.co/ZRrS2S3Q/LLF89-04.webp"},
                {"PowerMax Treadmill",                       "2.0HP motorized treadmill with 12 preset programs, foldable",     "24999", "https://i.ibb.co/dwSYTRFt/TAC-550.png"},
                {"Decathlon Resistance Bands Set",           "Set of 5 resistance bands with varying tension levels",           "699",   "https://i.ibb.co/fYK0mqVz/p2263887.jpg"},
                {"Vector X Cricket Helmet",                  "ABS shell cricket helmet with steel grille and adjustable fit",   "1499",  "https://i.ibb.co/ymt6Jrhv/p1578846.jpg"}
            },
            // Books & Media - 15 products
            {
                {"Atomic Habits – James Clear",              "Practical guide to building good habits and breaking bad ones",   "399",   "https://i.ibb.co/CKYK6R0X/IMG-3682.webp"},
                {"The Psychology of Money – Morgan Housel",  "Timeless lessons on wealth, greed, and happiness",               "349",   "https://i.ibb.co/0jT99PvY/IMG-1554.jpg"},
                {"Rich Dad Poor Dad – Robert Kiyosaki",      "What the rich teach their kids about money that the poor don't",  "299",   "https://i.ibb.co/mFCZF1hc/IMG-7552.webp"},
                {"Ikigai – Hector Garcia",                   "Japanese concept of finding purpose and the art of staying young","299",   "https://i.ibb.co/NgDJcxFm/av-books-store-ikigai-the-japanese-secret-to-a-long-and-happy-life-english-paperback-hector-garcia-f.jpg"},
                {"Wings of Fire – APJ Abdul Kalam",          "Autobiography of India's missile man and former president",       "199",   "https://i.ibb.co/PzxpbVQN/av-books-store-wings-of-fire-by-dr-a-p-j-abdul-kalam-original-imaf4fpetyhcz5xq.jpg"},
                {"The Alchemist – Paulo Coelho",             "Philosophical novel about following one's dream and destiny",     "299",   "https://i.ibb.co/wZPhff0K/the-alchemist-paulo-coelho.jpg"},
                {"Think and Grow Rich – Napoleon Hill",      "Classic self-help book on achieving success through mindset",     "249",   "https://i.ibb.co/pr1Q62Lb/think-and-grow-rich-napoleon-hill.jpg"},
                {"Do Epic Shit – Ankur Warikoo",             "Brutally honest lessons about life, work, and relationships",     "399",   "https://i.ibb.co/cSx7463c/do-epic-shit-ankur-warikoo.jpg"},
                {"The 5 AM Club – Robin Sharma",             "Master your mornings, elevate your life with the 20/20/20 rule", "349",   "https://i.ibb.co/b55yCLKn/the-5am-club-robin-sharma.jpg"},
                {"Can't Hurt Me – David Goggins",            "Master your mind and defy the odds through mental toughness",     "499",   "https://i.ibb.co/hRMfLFkW/cant-hurt-me-david-goggins.jpg"},
                {"Harry Potter and the Philosopher's Stone", "The first book in J.K. Rowling's iconic fantasy series",          "499",   "https://i.ibb.co/Q7fR3pw4/harry-potter-philosophers-stone.jpg"},
                {"The Power of Your Subconscious Mind",      "Unlock your subconscious mind to achieve goals and happiness",    "199",   "https://i.ibb.co/k6WJfxxv/power-of-subconscious-mind.jpg"},
                {"Attitude Is Everything – Jeff Keller",     "Change your attitude, change your life with 12 proven principles","249",   "https://i.ibb.co/k2jymTRy/attitude-is-everything-jeff-keller.jpg"},
                {"Deep Work – Cal Newport",                  "Rules for focused success in a distracted world",                 "399",   "https://i.ibb.co/dsDjrJ0J/deep-work-cal-newport.jpg"},
                {"Start With Why – Simon Sinek",             "How great leaders inspire everyone to take action",               "349",   "https://i.ibb.co/23qLgx6M/start-with-why-simon-sinek.jpg"}
            }
        };

        // Seed quantities per category: Electronics, Clothing, Home & Garden, Sports & Fitness, Books & Media
        long[] seedQuantities = {30L, 100L, 50L, 75L, 150L};
        String[] warehouseLocations = {
            "Ambattur Tech Hub Warehouse, Ambattur Industrial Estate, Chennai - 600058",
            "Guindy Central Warehouse, SIDCO Industrial Estate, Guindy, Chennai - 600032",
            "Manali North Warehouse, Manali Industrial Area, Manali, Chennai - 600068",
            "Sholinganallur East Warehouse, SIPCOT IT Park, Sholinganallur, Chennai - 600119",
            "Perungudi Depot Warehouse, Perungudi Industrial Estate, Perungudi, Chennai - 600096"
        };

        int totalProducts = 0;
        for (int i = 0; i < categories.size(); i++) {
            Category category = categories.get(i);
            String[][] products = productData[i];

            for (int j = 0; j < products.length; j++) {
                Supplier supplier = suppliers.get((i * products.length + j) % suppliers.size());
                Product product = Product.builder()
                        .name(products[j][0])
                        .description(products[j][1])
                        .price(new BigDecimal(products[j][2]))
                        .category(category)
                        .supplier(supplier)
                        .imageUrl(products[j][3])
                        .build();
                Product saved = productRepository.save(product);
                inventoryRepository.save(Inventory.builder()
                        .product(saved)
                        .quantity(seedQuantities[i])
                        .warehouseLocation(warehouseLocations[i])
                        .build());
                stockMovementRepository.save(StockMovement.builder()
                        .productId(saved.getId())
                        .movementType(MovementType.IN)
                        .quantity(seedQuantities[i])
                        .referenceType("RESTOCK")
                        .build());
                totalProducts++;
            }
        }

        return totalProducts;
    }

    @Transactional
    public Map<String, Object> seedAdminUser() {
        if (userRepository.existsByUsername("raghul")) {
            return Map.of("skipped", true, "reason", "User 'raghul' already exists");
        }

        User user = userRepository.save(User.builder()
                .username("raghul")
                .email("rg@gmail.com")
                .password(passwordEncoder.encode("123456"))
                .active(true)
                .build());

        List<String> assignedRoles = new ArrayList<>();
        for (String roleName : List.of("USER", "ADMIN")) {
            Role role = roleRepository.findByName(roleName)
                    .orElseGet(() -> roleRepository.save(Role.builder().name(roleName).build()));
            userRoleRepository.save(UserRole.builder().user(user).role(role).build());
            assignedRoles.add(roleName);
        }

        entityManager.flush();
        entityManager.createNativeQuery("UPDATE users SET created_at = '2025-01-12 00:00:00' WHERE username = 'raghul'").executeUpdate();

        return Map.of("created", true, "username", user.getUsername(), "email", user.getEmail(), "rolesAssigned", assignedRoles);
    }

    @Transactional
    public void seedStaffUsers() {
        String[][] staffData = {
            // username, email,                      password,  role
            {"velu",  "velu@ecom.com",               "123456", "ADMIN_ORDER"},
            {"guna",  "guna@ecom.com",               "123456", "ADMIN_STOCK"},
            {"arun",  "arun@chentechdist.com",       "123456", "SUPPLIER"},
            {"devi",  "devi@coromandeltr.com",       "123456", "SUPPLIER"},
            {"kavi",  "kavi@marinawholesale.com",    "123456", "SUPPLIER"},
            {"bala",  "bala@pallavansupply.com",     "123456", "SUPPLIER"},
            {"mani",  "mani@ponniyarimp.com",        "123456", "SUPPLIER"},
            {"naga",  "naga@kaveritrading.com",      "123456", "SUPPLIER"},
            {"ravi",  "ravi@gmail.com",              "123456", "USER"},
            {"ajay",  "ajay@gmail.com",              "123456", "USER"},
            {"asha",  "asha@gmail.com",              "123456", "USER"},
            {"gopi",  "gopi@gmail.com",              "123456", "USER"},
            {"nila",  "nila@gmail.com",              "123456", "USER"}
        };

        for (String[] data : staffData) {
            if (userRepository.existsByUsername(data[0])) continue;

            User user = userRepository.save(User.builder()
                    .username(data[0])
                    .email(data[1])
                    .password(passwordEncoder.encode(data[2]))
                    .active(true)
                    .build());

            Role role = roleRepository.findByName(data[3])
                    .orElseGet(() -> roleRepository.save(Role.builder().name(data[3]).build()));
            userRoleRepository.save(UserRole.builder().user(user).role(role).build());
        }

        entityManager.flush();
        entityManager.createNativeQuery("UPDATE users SET created_at = '2025-01-12 00:00:00'").executeUpdate();
    }

    @Transactional
    public int seedOrders() {
        if (orderRepository.count() > 0) return 0;

        List<Product> prods = productRepository.findAll(Sort.by(Sort.Direction.ASC, "id"));
        if (prods.size() < 50) return 0;

        List<User> userList = new ArrayList<>();
        for (String name : new String[]{"ravi", "ajay", "asha", "gopi", "nila", "raghul"}) {
            userRepository.findByUsername(name).ifPresent(userList::add);
        }
        if (userList.size() < 6) return 0;

        Map<Long, Long> stock = new HashMap<>();
        prods.forEach(p -> inventoryRepository.findByProduct_Id(p.getId())
                .ifPresent(inv -> stock.put(p.getId(), inv.getQuantity())));

        List<long[]> orderDates    = new ArrayList<>();
        List<long[]> movementDates = new ArrayList<>();

        Random rng = new Random(42); // fixed seed — reproducible data every run

        LocalDate month  = LocalDate.of(2025, 1, 1);
        LocalDate last   = LocalDate.of(2026, 3, 17);

        while (!month.isAfter(last)) {
            int ordersThisMonth = 30 + rng.nextInt(7); // 30–36
            int daysInMonth     = (int) Math.min(month.lengthOfMonth(),
                                      ChronoUnit.DAYS.between(month, last) + 1);

            for (int i = 0; i < ordersThisMonth; i++) {
                User user = userList.get(i % userList.size());
                int  day  = 1 + rng.nextInt(daysInMonth);
                LocalDateTime date = month.withDayOfMonth(day).atTime(8 + rng.nextInt(12), rng.nextInt(60));

                // 1–3 unique products per order
                int numItems = 1 + rng.nextInt(3);
                Set<Integer> used = new HashSet<>();
                int[][] items = new int[numItems][2];
                for (int j = 0; j < numItems; j++) {
                    int idx;
                    do { idx = rng.nextInt(prods.size()); } while (used.contains(idx));
                    used.add(idx);
                    items[j][0] = idx;
                    items[j][1] = 1 + rng.nextInt(3); // qty 1–3
                }

                // Auto-restock if any item would go out of stock
                for (int[] item : items) {
                    Product p = prods.get(item[0]);
                    if (stock.getOrDefault(p.getId(), 0L) < item[1]) {
                        addInward(p, 50L, date.minusHours(1), stock, movementDates);
                    }
                }

                OrderStatus status = pickStatus(month, rng);
                String name = capitalize(user.getUsername());
                addOrder(user, name, user.getEmail(), date, status, items, prods, stock, orderDates, movementDates);
            }

            month = month.plusMonths(1);
        }

        entityManager.flush();

        for (long[] od : orderDates) {
            LocalDateTime dt = LocalDate.ofEpochDay(od[1]).atTime(10, 0);
            entityManager.createNativeQuery("UPDATE orders SET created_at = :dt WHERE id = :id")
                    .setParameter("dt", dt).setParameter("id", od[0]).executeUpdate();
        }

        for (long[] md : movementDates) {
            LocalDateTime dt = LocalDate.ofEpochDay(md[1]).atTime(9, 0);
            entityManager.createNativeQuery("UPDATE stock_movements SET movement_date = :dt WHERE id = :id")
                    .setParameter("dt", dt).setParameter("id", md[0]).executeUpdate();
        }

        return orderDates.size();
    }

    private OrderStatus pickStatus(LocalDate month, Random rng) {
        long monthsAgo = ChronoUnit.MONTHS.between(month, LocalDate.of(2026, 3, 1));
        int r = rng.nextInt(100);
        if (monthsAgo >= 6) {
            return r < 10 ? OrderStatus.CANCELLED : OrderStatus.DELIVERED;
        } else if (monthsAgo >= 3) {
            if (r < 10) return OrderStatus.CANCELLED;
            if (r < 25) return OrderStatus.CONFIRMED;
            return OrderStatus.DELIVERED;
        } else if (monthsAgo >= 2) {
            if (r < 10) return OrderStatus.CANCELLED;
            if (r < 30) return OrderStatus.DELIVERED;
            if (r < 60) return OrderStatus.CONFIRMED;
            if (r < 80) return OrderStatus.PAYMENT;
            return OrderStatus.ORDERED;
        } else if (monthsAgo >= 1) {
            if (r < 10) return OrderStatus.CANCELLED;
            if (r < 25) return OrderStatus.CONFIRMED;
            if (r < 55) return OrderStatus.PAYMENT;
            return OrderStatus.ORDERED;
        } else {
            if (r < 10) return OrderStatus.CANCELLED;
            if (r < 20) return OrderStatus.PAYMENT;
            return OrderStatus.ORDERED;
        }
    }

    private String capitalize(String s) {
        return s == null || s.isEmpty() ? s : Character.toUpperCase(s.charAt(0)) + s.substring(1);
    }

    private void addInward(Product product, Long qty, LocalDateTime date,
                           Map<Long, Long> stock, List<long[]> movementDates) {
        StockMovement mv = stockMovementRepository.save(StockMovement.builder()
                .productId(product.getId())
                .movementType(MovementType.IN)
                .quantity(qty)
                .referenceType("RESTOCK")
                .build());

        stock.merge(product.getId(), qty, Long::sum);
        inventoryRepository.findByProduct_Id(product.getId()).ifPresent(inv -> {
            inv.setQuantity(stock.get(product.getId()));
            inventoryRepository.save(inv);
        });

        movementDates.add(new long[]{mv.getId(), date.toLocalDate().toEpochDay()});
    }

    private void addOrder(User user, String customerName, String customerEmail,
                          LocalDateTime date, OrderStatus status, int[][] items,
                          List<Product> prods, Map<Long, Long> stock,
                          List<long[]> orderDates, List<long[]> movementDates) {
        Order order = Order.builder()
                .user(user)
                .customerName(customerName)
                .customerEmail(customerEmail)
                .status(status)
                .totalAmount(BigDecimal.ZERO)
                .orderedAt(status == OrderStatus.CANCELLED ? null : date)
                .build();

        switch (status) {
            case PAYMENT    -> order.setPaymentAt(date.plusDays(1));
            case CONFIRMED  -> { order.setPaymentAt(date.plusDays(1)); order.setConfirmationAt(date.plusDays(2)); }
            case DELIVERED  -> { order.setPaymentAt(date.plusDays(1)); order.setConfirmationAt(date.plusDays(3)); order.setDeliveryAt(date.plusDays(7)); }
            case CANCELLED  -> order.setCancelledAt(date.plusDays(2));
            default -> {}
        }

        Order saved = orderRepository.save(order);
        saved.setOrderNumber(String.format("ORD-%s-%04d",
                date.format(DateTimeFormatter.ofPattern("yyyyMMdd")), saved.getId()));
        orderRepository.save(saved);

        BigDecimal total = BigDecimal.ZERO;
        for (int[] item : items) {
            Product p = prods.get(item[0]);
            long qty  = item[1];

            orderItemRepository.save(OrderItem.builder()
                    .order(saved).product(p).quantity(qty).price(p.getPrice())
                    .build());
            total = total.add(p.getPrice().multiply(BigDecimal.valueOf(qty)));

            // OUT movement (always recorded, even for cancelled — then restore with IN)
            StockMovement outMv = stockMovementRepository.save(StockMovement.builder()
                    .productId(p.getId()).movementType(MovementType.OUT).quantity(qty)
                    .referenceType("ORDER").referenceId(saved.getId())
                    .build());
            movementDates.add(new long[]{outMv.getId(), date.toLocalDate().toEpochDay()});

            if (status == OrderStatus.CANCELLED) {
                // Restore stock with IN movement
                StockMovement inMv = stockMovementRepository.save(StockMovement.builder()
                        .productId(p.getId()).movementType(MovementType.IN).quantity(qty)
                        .referenceType("ORDER_CANCEL").referenceId(saved.getId())
                        .build());
                movementDates.add(new long[]{inMv.getId(), date.plusDays(2).toLocalDate().toEpochDay()});
            } else {
                stock.merge(p.getId(), -qty, Long::sum);
                inventoryRepository.findByProduct_Id(p.getId()).ifPresent(inv -> {
                    inv.setQuantity(stock.get(p.getId()));
                    inventoryRepository.save(inv);
                });
            }
        }

        saved.setTotalAmount(total);
        orderRepository.save(saved);
        orderDates.add(new long[]{saved.getId(), date.toLocalDate().toEpochDay()});
    }

    @Transactional
    public Map<String, List<String>> seedRoles() {
        List<String> required = List.of("USER", "SUPPLIER", "ADMIN_STOCK", "ADMIN_ORDER", "ADMIN");
        List<String> created = new ArrayList<>();
        List<String> skipped = new ArrayList<>();

        for (String roleName : required) {
            if (roleRepository.findByName(roleName).isPresent()) {
                skipped.add(roleName);
            } else {
                roleRepository.save(Role.builder().name(roleName).build());
                created.add(roleName);
            }
        }

        return Map.of("created", created, "skipped", skipped);
    }
}
