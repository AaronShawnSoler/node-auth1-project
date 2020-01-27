
exports.up = function(knex) {
    return knex.schema
        .createTable('Users', tbl => {
            tbl.increments('user_id');
            tbl.string('username')
                .unique()
                .notNullable();
            tbl.text('password')
                .unique()
                .notNullable();
        });
};

exports.down = function(knex) {
    
};
