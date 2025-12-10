const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Car Rental API',
            version: '1.0.0',
            description: 'Comprehensive Car Rental API with authentication, car management, reservations, and more',
            contact: {
                name: 'API Support',
                email: 'support@carrental.com'
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT'
            }
        },
        servers: [
            {
                url: 'http://localhost:3000/api',
                description: 'Development server',
            },
            {
                url: 'https://api.carrental.com/api',
                description: 'Production server',
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter your Bearer token (without the "Bearer " prefix)'
                },
            },
            schemas: {
                // User & Authentication Schemas
                User: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'User ID'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'User email address'
                        },
                        nom: {
                            type: 'string',
                            description: 'User last name'
                        },
                        prenom: {
                            type: 'string',
                            description: 'User first name'
                        },
                        numeroTelephone: {
                            type: 'string',
                            description: 'User phone number'
                        },
                        role: {
                            type: 'integer',
                            description: 'User role ID'
                        }
                    }
                },
                LoginRequest: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'user@example.com'
                        },
                        password: {
                            type: 'string',
                            minLength: 6,
                            example: 'password123'
                        }
                    }
                },
                LoginResponse: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: true
                        },
                        accessToken: {
                            type: 'string',
                            description: 'JWT access token'
                        },
                        user: {
                            $ref: '#/components/schemas/User'
                        }
                    }
                },
                RegisterRequest: {
                    type: 'object',
                    required: ['email', 'password', 'firstname', 'lastname', 'phonenumber'],
                    properties: {
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'newuser@example.com'
                        },
                        password: {
                            type: 'string',
                            minLength: 8,
                            example: 'securepassword123'
                        },
                        firstname: {
                            type: 'string',
                            maxLength: 50,
                            example: 'John'
                        },
                        lastname: {
                            type: 'string',
                            maxLength: 50,
                            example: 'Doe'
                        },
                        phonenumber: {
                            type: 'string',
                            maxLength: 50,
                            example: '+1234567890'
                        }
                    }
                },

                // Car Schemas
                Car: {
                    type: 'object',
                    required: ['name_car', 'marque_car', 'modele_car', 'annee_car', 'prix_car'],
                    properties: {
                        ID_Car: {
                            type: 'integer',
                            description: 'Car ID'
                        },
                        name_car: {
                            type: 'string',
                            description: 'Car name',
                            example: 'Tesla Model 3'
                        },
                        marque_car: {
                            type: 'string',
                            description: 'Car brand',
                            example: 'Tesla'
                        },
                        modele_car: {
                            type: 'string',
                            description: 'Car model',
                            example: 'Model 3'
                        },
                        annee_car: {
                            type: 'integer',
                            minimum: 1900,
                            maximum: 2030,
                            description: 'Car year',
                            example: 2020
                        },
                        kilometrage_car: {
                            type: 'number',
                            description: 'Car mileage in km',
                            example: 50000
                        },
                        prix_car: {
                            type: 'number',
                            description: 'Car rental price per day',
                            example: 45.99
                        },
                        id_seller: {
                            type: 'integer',
                            description: 'Seller user ID'
                        }
                    }
                },

                // Image Schemas
                CarImage: {
                    type: 'object',
                    properties: {
                        ID_Image: {
                            type: 'integer',
                            description: 'Image ID'
                        },
                        ID_Car: {
                            type: 'integer',
                            description: 'Car ID'
                        },
                        Image_Path: {
                            type: 'string',
                            description: 'Image file path'
                        },
                        Image_Name: {
                            type: 'string',
                            description: 'Image filename'
                        },
                        Original_Name: {
                            type: 'string',
                            description: 'Original filename'
                        },
                        Image_Type: {
                            type: 'string',
                            enum: ['main', 'interior', 'exterior', 'engine', 'other'],
                            description: 'Type of image'
                        },
                        Image_Description: {
                            type: 'string',
                            description: 'Image description'
                        },
                        Image_Size: {
                            type: 'integer',
                            description: 'File size in bytes'
                        },
                        Image_Width: {
                            type: 'integer',
                            description: 'Image width in pixels'
                        },
                        Image_Height: {
                            type: 'integer',
                            description: 'Image height in pixels'
                        },
                        Display_Order: {
                            type: 'integer',
                            description: 'Display order for sorting'
                        },
                        Is_Primary: {
                            type: 'boolean',
                            description: 'Whether this is the primary image'
                        }
                    }
                },

                // Reservation Schemas
                Reservation: {
                    type: 'object',
                    properties: {
                        ID_Reservation: {
                            type: 'integer',
                            description: 'Reservation ID'
                        },
                        ID_Car: {
                            type: 'integer',
                            description: 'Car ID'
                        },
                        ID_Client: {
                            type: 'integer',
                            description: 'Client ID'
                        },
                        startDate: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Reservation start date'
                        },
                        endDate: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Reservation end date'
                        },
                        status: {
                            type: 'string',
                            enum: ['pending', 'confirmed', 'cancelled', 'completed'],
                            description: 'Reservation status'
                        },
                        total_price: {
                            type: 'number',
                            description: 'Total reservation price'
                        }
                    }
                },

                // Review Schemas
                Review: {
                    type: 'object',
                    properties: {
                        ID_Review: {
                            type: 'integer',
                            description: 'Review ID'
                        },
                        ID_Car: {
                            type: 'integer',
                            description: 'Car ID'
                        },
                        ID_Client: {
                            type: 'integer',
                            description: 'Reviewer ID'
                        },
                        rating: {
                            type: 'integer',
                            minimum: 1,
                            maximum: 5,
                            description: 'Rating from 1 to 5'
                        },
                        comment: {
                            type: 'string',
                            description: 'Review comment'
                        },
                        created_at: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Review creation date'
                        }
                    }
                },

                // Settings Schema
                Settings: {
                    type: 'object',
                    properties: {
                        notifications: {
                            type: 'boolean',
                            description: 'Enable notifications'
                        },
                        language: {
                            type: 'string',
                            enum: ['en', 'fr', 'es', 'de'],
                            description: 'Preferred language'
                        },
                        theme: {
                            type: 'string',
                            enum: ['light', 'dark', 'auto'],
                            description: 'UI theme preference'
                        },
                        currency: {
                            type: 'string',
                            enum: ['USD', 'EUR', 'GBP', 'CAD'],
                            description: 'Preferred currency'
                        }
                    }
                },

                // Generic Response Schemas
                SuccessResponse: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: true
                        },
                        message: {
                            type: 'string',
                            example: 'Operation completed successfully'
                        },
                        data: {
                            type: 'object',
                            description: 'Response data'
                        }
                    }
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false
                        },
                        error: {
                            type: 'string',
                            description: 'Error message'
                        },
                        message: {
                            type: 'string',
                            description: 'Detailed error description'
                        },
                        details: {
                            type: 'array',
                            items: {
                                type: 'string'
                            },
                            description: 'Additional error details'
                        }
                    }
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: [
        './services/**/*.js',
        './api/routes/*.js',
        './api/api.js'
    ]
};

const specs = swaggerJsdoc(options);

module.exports = {
    specs,
    swaggerUi,
};