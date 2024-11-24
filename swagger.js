const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Cấu hình Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Food Ordering API",
      version: "1.0.0",
      description: "API documentation for the Food Ordering application",
    },
    servers: [
      {
        url: process.env.API_URL || "https://backend-mern-food-ordering.onrender.com", // URL Backend trên Render
        description: "Production server",
      },
      {
        url: "http://localhost:5000", // URL cục bộ khi phát triển
        description: "Local development server",
      },
    ],
    components: {
      schemas: {
        Order: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "The ID of the order",
            },
            userId: {
              type: "string",
              description: "The ID of the user who placed the order",
            },
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  foodItem: {
                    type: "string",
                    description: "The ID of the food item",
                  },
                  name: {
                    type: "string",
                    description: "The name of the food item",
                  },
                  price: {
                    type: "number",
                    description: "The price of the food item",
                  },
                  quantity: {
                    type: "integer",
                    description: "The quantity ordered",
                  },
                },
              },
              description: "List of items in the order",
            },
            totalPrice: {
              type: "number",
              description: "The total price of the order",
            },
            customerName: {
              type: "string",
              description: "The name of the customer",
            },
            address: {
              type: "string",
              description: "The delivery address",
            },
            phone: {
              type: "string",
              description: "The customer's phone number",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Order creation timestamp",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Order update timestamp",
            },
          },
          required: ["userId", "items", "totalPrice", "customerName", "address", "phone"],
        },
        FoodItem: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "The ID of the food item",
            },
            name: {
              type: "string",
              description: "The name of the food item",
            },
            description: {
              type: "string",
              description: "A short description of the food item",
            },
            price: {
              type: "number",
              description: "The price of the food item",
            },
            category: {
              type: "string",
              description: "The category of the food item",
            },
            imageUrl: {
              type: "string",
              description: "URL of the food item's image",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Food item creation timestamp",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Food item update timestamp",
            },
          },
          required: ["name", "price", "category"],
        },
      },
    },
  },
  apis: ["./routes/*.js"], // Chỉ định nơi định nghĩa các route API
};

// Khởi tạo Swagger Docs
const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = (app) => {
  // Tích hợp Swagger UI vào ứng dụng
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};
