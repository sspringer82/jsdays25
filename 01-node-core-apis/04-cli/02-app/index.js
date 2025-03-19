#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';
import { Command } from 'commander';
import chalk from 'chalk';

// Create a new program instance (ESM version of Commander uses named imports)
const program = new Command();

// Get current file directory equivalent for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define CLI command with arguments and options
program
  .version('1.0.0')
  .description('A simple CLI app to copy files with optional compression')
  .arguments('<source> <destination>')
  .option('-c, --compress', 'Compress the file using gzip')
  .option('-v, --verbose', 'Show verbose output')
  .action((source, destination, options) => {
    // Resolve paths
    const sourcePath = path.resolve(source);
    const destinationPath = path.resolve(destination);

    // Check if source file exists
    if (!fs.existsSync(sourcePath)) {
      console.error(chalk.red(`Error: Source file does not exist: ${chalk.bold(sourcePath)}`));
      process.exit(1);
    }

    try {
      // Create destination directory if it doesn't exist
      const destinationDir = path.dirname(destinationPath);
      if (!fs.existsSync(destinationDir)) {
        fs.mkdirSync(destinationDir, { recursive: true });
        if (options.verbose) {
          console.log(chalk.blue(`Created directory: ${chalk.bold(destinationDir)}`));
        }
      }

      // If compression is enabled
      if (options.compress) {
        // Add .gz extension if not already present
        const compressedDestination = destinationPath.endsWith('.gz') 
          ? destinationPath 
          : `${destinationPath}.gz`;
        
        const readStream = fs.createReadStream(sourcePath);
        const writeStream = fs.createWriteStream(compressedDestination);
        const gzip = zlib.createGzip();
        
        readStream.pipe(gzip).pipe(writeStream);
        
        writeStream.on('finish', () => {
          if (options.verbose) {
            const originalStats = fs.statSync(sourcePath);
            const compressedStats = fs.statSync(compressedDestination);
            const compressionRatio = (compressedStats.size / originalStats.size * 100).toFixed(2);
            
            console.log(chalk.green(`Successfully compressed and copied file:`));
            console.log(chalk.cyan(`  Source: ${chalk.bold(sourcePath)}`));
            console.log(chalk.cyan(`  Destination: ${chalk.bold(compressedDestination)}`));
            console.log(chalk.yellow(`  Original size: ${chalk.bold(originalStats.size)} bytes`));
            console.log(chalk.yellow(`  Compressed size: ${chalk.bold(compressedStats.size)} bytes`));
            
            // Show compression ratio with color based on effectiveness
            const ratioColor = compressionRatio < 50 ? 'green' : 
                              compressionRatio < 80 ? 'yellow' : 'red';
            console.log(chalk[ratioColor](`  Compression ratio: ${chalk.bold(compressionRatio)}%`));
          } else {
            console.log(chalk.green(`File compressed and copied to ${chalk.bold(compressedDestination)}`));
          }
        });
      } else {
        // Simple copy without compression
        fs.copyFileSync(sourcePath, destinationPath);
        
        if (options.verbose) {
          console.log(chalk.green(`Successfully copied file:`));
          console.log(chalk.cyan(`  Source: ${chalk.bold(sourcePath)}`));
          console.log(chalk.cyan(`  Destination: ${chalk.bold(destinationPath)}`));
          
          const stats = fs.statSync(destinationPath);
          console.log(chalk.yellow(`  File size: ${chalk.bold(stats.size)} bytes`));
        } else {
          console.log(chalk.green('File copied successfully'));
        }
      }
    } catch (error) {
      console.error(chalk.red(`Error processing file: ${chalk.bold(error.message)}`));
      process.exit(1);
    }
  });

program.parse(process.argv);

// Show help if no arguments are provided
if (program.args.length === 0) {
  program.help();
}