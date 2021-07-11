// Module to validate the required fields to process a request

const Joi = require("Joi");

// Required fields for different requests specified using their api path/route
const schemas = [
    {
        route: "/user/login",
        schema: function(){
            return Joi.object({
                email: Joi.string().email().required(),
                password: Joi.string().min(4).required(),
            });
        },
    },

    {
        route: "/user/create",
        schema: function(){
            return Joi.object({
                first_name: Joi.string().required(),
                last_name: Joi.string().required(),
                email: Joi.string().email().required(),
                password: Joi.string().min(4).required(),
                type: Joi.string().valid('student', 'junior', 'mid', 'senior').required(),
            });
        },
    },

    {
        route: "/user/delete",
        schema: function(){
            return Joi.object({
                id: Joi.number().integer().required(),
            });
        },
    },

    {
        route: "/user/update",
        schema: function(){
            return Joi.object({
                id: Joi.number().integer().required(),
                first_name: Joi.string(),
                last_name: Joi.string(),
                type: Joi.string().valid('student', 'junior', 'mid', 'senior'),
            });
        },
    },

    {
        route: "/organization/create",
        schema: function(){
            return Joi.object({
                name: Joi.string().required(),
            });
        },
    },

    {
        route: "/organization/delete",
        schema: function(){
            return Joi.object({
                id: Joi.number().integer().required(),
            });
        },
    },

    {
        route: "/organization/update",
        schema: function(){
            return Joi.object({
                id: Joi.number().integer().required(),
                name: Joi.string(),
            });
        },
    },

    {
        route: "/organization/manager/update",
        schema: function(){
            return Joi.object({
                id: Joi.number().integer().required(),
                user_id: Joi.number().integer().required(),
            });
        },
    },

    {
        route: "/project/create",
        schema: function(){
            return Joi.object({
                organization_id: Joi.number().integer().required(),
                name: Joi.string().required(),
            });
        },
    },

    {
        route: "/project/delete",
        schema: function(){
            return Joi.object({
                id: Joi.number().integer().required(),
            });
        },
    },

    {
        route: "/project/update",
        schema: function(){
            return Joi.object({
                id: Joi.number().integer().required(),
                name: Joi.string(),
            });
        },
    },

    {
        route: "/project/column/create",
        schema: function(){
            return Joi.object({
                id: Joi.number().integer().required(),
                name: Joi.string().required(),
            });
        },
    },

    {
        route: "/project/column/update",
        schema: function(){
            return Joi.object({
                id: Joi.number().integer().required(),
                kanban_id: Joi.number().integer().required(),
                position_new: Joi.number().integer(),
                position_old: Joi.number().integer().when("position_new", {
                    is: Joi.exist(),
                    then: Joi.required(),
                }),
            });
        },
    },

    {
        route: "/project/column/delete",
        schema: function(){
            return Joi.object({
                id: Joi.number().integer().required(),
                kanban_id: Joi.number().integer().required(),
            });
        },
    },

    {
        route: "/project/card/create",
        schema: function(){
            return Joi.object({
                id: Joi.number().integer().required(),
                kanban_id: Joi.number().integer().required(),
                title: Joi.string().required(),
                description: Joi.string().required(),
                start_date: Joi.date().required(),
                end_date: Joi.date().required(),
                importance: Joi.number().greater(0).less(6).integer().required(),
                color: Joi.string().valid("black", "#084c61"),
            });
        },
    },

    {
        route: "/project/card/delete",
        schema: function(){
            return Joi.object({
                id: Joi.number().integer().required(),
                kanban_id: Joi.number().integer().required(),
                kanban_column_id: Joi.number().integer().required(),
            });
        },
    },

    {
        route: "/project/card/update",
        schema: function(){
            return Joi.object({
                id: Joi.number().integer().required(),
                kanban_id: Joi.number().integer().required(),
                new_kanban_column_id: Joi.number().integer(),
                old_kanban_column_id: Joi.number().integer().when("new_kanban_column_id", {
                    is: Joi.exist(),
                    then: Joi.required(),
                }),
            });
        },
    },

    {
        route: "/project/card/color/update",
        schema: function(){
            return Joi.object({
                id: Joi.number().integer().required(),
                color: Joi.string().valid("black", "#084c61"),
            });
        },
    },

    {
        route: "/organization/member/assign",
        schema: function(){
            return Joi.object({
                id: Joi.number().integer().required(),
                user_id: Joi.number().integer().required(),
            });
        },
    },

    {
        route: "/project/member/assign",
        schema: function(){
            return Joi.object({
                id: Joi.number().integer().required(),
                user_id: Joi.number().integer().required(),
            });
        },
    },

    {
        route: "/project/member/remove",
        schema: function(){
            return Joi.object({
                id: Joi.number().integer().required(),
                user_id: Joi.number().integer().required(),
            });
        },
    },
];

function validate(request, response, next){
    console.log(request.fields, request.originalUrl);
    try{
        const schema = schemas.find(x => x.route.toString().trim() == request.originalUrl.toString().trim()).schema();

        // Schema options
        const options = {
            abortEarly: false, // Include all errors
            allowUnknown: true, // Ignore unknown props
            stripUnknown: true // Remove unknown props
        };

        // Validate request fields against schema
        const { error, value } = schema.validate(request.fields, options);
        
        if(error) {
            // On fail return comma separated errors
            next(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
        }else {
            // On success replace request.fields with validated value and trigger next middleware function
            request.fields = value;
            next();
        }
    }catch(error){
        next(error);
    }
}

module.exports = {
    validate,
}