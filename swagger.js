const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Cấu hình Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Food Ordering API",
      version: "1.0.0",
      description: "API cho ứng dụng đặt món ăn",
    },
    servers: [
      {
        url: "http://localhost:5000", // URL backend của bạn
      },
    ],
    components: {
      schemas: {
        // Schema cho Order
        Order: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "ID của đơn hàng",
            },
            userId: {
              type: "string",
              description: "ID của người dùng",
            },
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  foodItem: {
                    type: "string",
                    description: "ID món ăn",
                  },
                  name: {
                    type: "string",
                    description: "Tên món ăn",
                  },
                  price: {
                    type: "number",
                    description: "Giá món ăn",
                  },
                  quantity: {
                    type: "integer",
                    description: "Số lượng món ăn",
                  },
                },
              },
            },
            totalPrice: {
              type: "number",
              description: "Tổng giá trị đơn hàng",
            },
            customerName: {
              type: "string",
              description: "Tên khách hàng",
            },
            address: {
              type: "string",
              description: "Địa chỉ giao hàng",
            },
            phone: {
              type: "string",
              description: "Số điện thoại khách hàng",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Thời gian tạo đơn hàng",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Thời gian cập nhật đơn hàng",
            },
          },
        },
        // Schema cho FoodItem
        FoodItem: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "ID của món ăn",
            },
            name: {
              type: "string",
              description: "Tên món ăn",
            },
            description: {
              type: "string",
              description: "Mô tả món ăn",
            },
            price: {
              type: "number",
              description: "Giá của món ăn",
            },
            category: {
              type: "string",
              description: "Loại món ăn",
            },
            imageUrl: {
              type: "string",
              description: "URL hình ảnh của món ăn",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Thời gian tạo món ăn",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Thời gian cập nhật món ăn",
            },
          },
        },
      },
    },
  },
  apis: ["./routes/*.js"], // Đường dẫn tới các file chứa định nghĩa API
};

// Khởi tạo Swagger
const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};
