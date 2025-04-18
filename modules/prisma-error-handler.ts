type MyPrismaError = {
    prismaError: any
}

type ErrorCodes = {
    code: string
    message: string
}

export const myPrismaErrorHandler = async ({ prismaError }: MyPrismaError) => {
    // console.log(prismaError.code, prismaError.message);

    const errorCodes: ErrorCodes[] = [
        {
            code: 'P1000',
            message: `Authentication failed against database server`,
        },
        { code: 'P1001', message: `Can't reach database server` },
        {
            code: 'P1002',
            message: `The database server was reached but timed out`,
        },
        { code: 'P1003', message: `Database does not exist` },
        { code: 'P1004', message: `Unkown Error` },
        { code: 'P1005', message: `Unkown Error` },
        { code: 'P1006', message: `Unkown Error` },
        { code: 'P1007', message: `Unkown Error` },
        { code: 'P1008', message: `Operations timed out` },
        {
            code: 'P1009',
            message: `Database already exists on the database server`,
        },
        { code: 'P1010', message: `User was denied access on the database` },
        { code: 'P1011', message: `Error opening a TLS connection` },
        { code: 'P1012', message: `Prisma Upgrade Error` },
        { code: 'P1013', message: `The provided database string is invalid.` },
        {
            code: 'P1014',
            message: `The underlying {kind} for model {model} does not exist.`,
        },
        {
            code: 'P1015',
            message: `Your Prisma schema is using features that are not supported for the version of the database.`,
        },
        {
            code: 'P1016',
            message: `Your raw query had an incorrect number of parameters.`,
        },
        { code: 'P1017', message: `Server has closed the connection."` },
        { code: 'P1018', message: `Unkown Error` },
        { code: 'P1019', message: `Unkown Error` },
        {
            code: 'P2000',
            message: `The provided value for the column is too long for the column's type`,
        },
        { code: 'P2001', message: `The record searched for does not exist` },
        { code: 'P2002', message: `Unique constraint failed ` },
        {
            code: 'P2003',
            message: `Foreign key constraint failed on the field`,
        },
        { code: 'P2004', message: `A constraint failed on the database` },
        {
            code: 'P2005',
            message: `The value {field_value} stored in the database for the field is invalid for the field's type`,
        },
        { code: 'P2006', message: `The provided value for field is not valid` },
        { code: 'P2007', message: `Data validation error` },
        { code: 'P2008', message: `Failed to parse the query` },
        { code: 'P2009', message: `Failed to validate the query` },
        { code: 'P2010', message: `Raw query failed.` },
        { code: 'P2011', message: `Null constraint violation` },
        { code: 'P2012', message: `Missing a required` },
        { code: 'P2013', message: `Missing the required argument for field` },
        {
            code: 'P2014',
            message: `The change you are trying to make would violate the required relation`,
        },
        { code: 'P2015', message: `A related record could not be found.` },
        { code: 'P2016', message: `Query interpretation error.` },
        {
            code: 'P2017',
            message: `The records for relation are not connected.`,
        },
        {
            code: 'P2018',
            message: `The required connected records were not found.`,
        },
        { code: 'P2019', message: `Input error.` },
        { code: 'P2020', message: `Value out of range for the type.` },
        {
            code: 'P2021',
            message: `The table does not exist in the current database.`,
        },
        {
            code: 'P2022',
            message: `The column does not exist in the current database.`,
        },
        { code: 'P2023', message: `Inconsistent column data` },
        {
            code: 'P2024',
            message: `Timed out fetching a new connection from the connection pool.`,
        },
        {
            code: 'P2025',
            message: `An operation failed because it depends on one or more records that were required but not found. `,
        },
        {
            code: 'P2026',
            message: `The current database provider doesn't support a feature that the query used`,
        },
        {
            code: 'P2027',
            message: `Multiple errors occurred on the database during query execution`,
        },
        { code: 'P2028', message: `Transaction API error` },
        { code: 'P2029', message: `Unkown Error` },
        {
            code: 'P2030',
            message: `Cannot find a fulltext index to use for the search`,
        },
        {
            code: 'P2031',
            message: `Prisma needs to perform transactions, which requires your MongoDB server to be run as a replica set. `,
        },
        { code: 'P2032', message: `Unkown Error` },
        {
            code: 'P2033',
            message: `A number used in the query does not fit into a 64 bit signed integer. Consider using BigInt as field type if you're trying to store large integers`,
        },
        {
            code: 'P2034',
            message: `Transaction failed due to a write conflict or a deadlock. Please retry your transaction`,
        },
        { code: 'P3000', message: `Failed to create database` },
        {
            code: 'P3001',
            message: `Migration possible with destructive changes and possible data loss`,
        },
        { code: 'P3002', message: `The attempted migration was rolled back` },
        {
            code: 'P3003',
            message: `The format of migrations changed, the saved migrations are no longer valid.`,
        },
        {
            code: 'P3004',
            message: `The database is a system database, it should not be altered with prisma migrate. Please connect to another database.`,
        },
        { code: 'P3005', message: `The database schema is not empty. ` },
        {
            code: 'P3006',
            message: `Migration failed to apply cleanly to the shadow database. `,
        },
        {
            code: 'P3007',
            message: `Some of the requested preview features are not yet allowed in schema engine. Please remove them from your data model before using migrations.`,
        },
        {
            code: 'P3008',
            message: `The migration is already recorded as applied in the database.`,
        },
        {
            code: 'P3009',
            message: `migrate found failed migrations in the target database, new migrations will not be applied.`,
        },
        {
            code: 'P3010',
            message: `The name of the migration is too long. It must not be longer than 200 characters (bytes).`,
        },
        {
            code: 'P3011',
            message: `Migration cannot be rolled back because it was never applied to the database.`,
        },
        {
            code: 'P3012',
            message: `Migration cannot be rolled back because it is not in a failed state.`,
        },
        {
            code: 'P3013',
            message: `Datasource provider arrays are no longer supported in migrate. Please change your datasource to use a single provider.`,
        },
        {
            code: 'P3014',
            message: `Prisma Migrate could not create the shadow database. Please make sure the database user has permission to create databases. `,
        },
        {
            code: 'P3015',
            message: `Could not find the migration file. Please delete the directory or restore the migration file.`,
        },
        {
            code: 'P3016',
            message: `The fallback method for database resets failed, meaning Migrate could not clean up the database entirely.`,
        },
        {
            code: 'P3017',
            message: `The migration could not be found. Please make sure that the migration exists, and that you included the whole name of the directory. `,
        },
        {
            code: 'P3018',
            message: `A migration failed to apply. New migrations cannot be applied before the error is recovered from. `,
        },
        {
            code: 'P3019',
            message: `The datasource provider specified in your schema does not match the one specified in the migration_lock.toml`,
        },
        {
            code: 'P3020',
            message: `The automatic creation of shadow databases is disabled on Azure SQL.`,
        },
        {
            code: 'P3021',
            message: `Foreign keys cannot be created on this database. `,
        },
        {
            code: 'P3022',
            message: `Direct execution of DDL (Data Definition Language) SQL statements is disabled on this database. `,
        },
        {
            code: 'P4000',
            message: `Introspection operation failed to produce a schema file`,
        },
        { code: 'P4001', message: `The introspected database was empty.` },
        {
            code: 'P4002',
            message: `The schema of the introspected database was inconsistent`,
        },
        {
            code: 'P5000',
            message: `This request could not be understood by the server`,
        },
        { code: 'P5001', message: `This request must be retried` },
        { code: 'P5002', message: `The datasource provided is invalid` },
        { code: 'P5003', message: `Requested resource does not exist` },
        { code: 'P5004', message: `The feature is not yet implemented` },
        { code: 'P5005', message: `Schema needs to be uploaded` },
        { code: 'P5006', message: `Unknown server error` },
        {
            code: 'P5007',
            message: `Unauthorized, check your connection string`,
        },
        { code: 'P5008', message: `Usage exceeded, retry again later` },
        { code: 'P5009', message: `Request timed out` },
        { code: 'P5010', message: `Cannot fetch data from service` },
        { code: 'P5011', message: `Request parameters are invalid.` },
        { code: 'P5012', message: `Engine version is not supported` },
        { code: 'P5013', message: `Engine not started: healthchec` },
        {
            code: 'P5014',
            message: `Unknown engine startup error (contains message and logs)`,
        },
        { code: 'P5015', message: `Interactive transaction error` },
        {
            code: 'P6000',
            message: `
		P6000 (ServerError)`,
        },
        {
            code: 'P6001',
            message: `The URL is malformed; for instance, it does not use the prisma:// protocol.`,
        },
        {
            code: 'P6002',
            message: `The API Key in the connection string is invalid.`,
        },
        {
            code: 'P6003',
            message: `The included usage of the current plan has been exceeded. `,
        },
        {
            code: 'P6004',
            message: `The global timeout of Accelerate has been exceeded.`,
        },
        {
            code: 'P6005',
            message: `The user supplied invalid parameters. Currently only relevant for transaction methods. For example, setting a timeout that is too high.`,
        },
        {
            code: 'P6006',
            message: `The chosen Prisma version is not compatible with Accelerate. This may occur when a user uses an unstable development version that we occasionally prune.`,
        },
        { code: 'P6007', message: `Unkown Error` },
        {
            code: 'P6008',
            message: `The engine failed to start. For example, it couldn't establish a connection to the database.`,
        },
        {
            code: 'P6009',
            message: `The global response size limit of Accelerate has been exceeded.`,
        },
    ]

    //modify message to be appropriate
    errorCodes[22].message =
        'some of your details already exist.Please try changing them'
    let loopCount = 0
    while (errorCodes[loopCount].code !== prismaError.code) {
        loopCount++
    }

    // console.log(loopCount);
    return errorCodes[loopCount].message
}
