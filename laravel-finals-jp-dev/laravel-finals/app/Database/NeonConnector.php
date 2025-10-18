<?php

namespace App\Database;

use Illuminate\Database\Connectors\PostgresConnector;
use PDO;

class NeonConnector extends PostgresConnector
{
    /**
     * Establish a database connection.
     *
     * @param  array  $config
     * @return \PDO
     */
    public function connect(array $config)
    {
        $dsn = $this->getDsn($config);

        // Get the NeonDB endpoint ID from config and add it to DSN options
        if (isset($config['endpoint_id']) && !empty($config['endpoint_id'])) {
            $dsn .= ";options='endpoint={$config['endpoint_id']}'";
        }

        $options = $this->getOptions($config);

        $connection = $this->createConnection($dsn, $config, $options);

        // Call parent's configuration methods
        $this->configureIsolationLevel($connection, $config);

        // Configure charset
        $charset = $config['charset'] ?? 'utf8';
        $connection->prepare("set names '{$charset}'")->execute();

        // Set the schema search path.
        if (isset($config['search_path']) || isset($config['schema'])) {
            $searchPath = $config['search_path'] ?? $config['schema'];
            $this->configureSearchPath($connection, $searchPath);
        }

        $this->configureTimezone($connection, $config);

        $this->configureSynchronousCommit($connection, $config);

        return $connection;
    }
}
