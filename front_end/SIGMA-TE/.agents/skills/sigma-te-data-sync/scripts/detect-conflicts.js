#!/usr/bin/env node

/**
 * SIGMA-TE - Conflict detection utility
 *
 * Purpose:
 * Compare a local record and a remote record to detect whether a sync conflict exists.
 *
 * This script does not resolve conflicts automatically.
 * It only reports differences so the sync skill can decide what to do next.
 */

const fs = require("fs");

function readJsonFile(filePath) {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw);
}

function isObject(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
}

function compareValues(localValue, remoteValue, path = "") {
    const differences = [];

    if (Array.isArray(localValue) || Array.isArray(remoteValue)) {
        const localJson = JSON.stringify(localValue);
        const remoteJson = JSON.stringify(remoteValue);

        if (localJson !== remoteJson) {
            differences.push({
                path,
                local: localValue,
                remote: remoteValue,
                reason: "array_difference",
            });
        }

        return differences;
    }

    if (isObject(localValue) && isObject(remoteValue)) {
        const keys = new Set([...Object.keys(localValue), ...Object.keys(remoteValue)]);

        for (const key of keys) {
            const childPath = path ? `${path}.${key}` : key;
            differences.push(...compareValues(localValue[key], remoteValue[key], childPath));
        }

        return differences;
    }

    if (localValue !== remoteValue) {
        differences.push({
            path,
            local: localValue,
            remote: remoteValue,
            reason: "value_difference",
        });
    }

    return differences;
}

function detectConflicts(localRecord, remoteRecord) {
    if (!isObject(localRecord) || !isObject(remoteRecord)) {
        throw new Error("Both records must be objects.");
    }

    const differences = compareValues(localRecord, remoteRecord);
    const conflict = differences.length > 0;

    return {
        conflict,
        differences,
        summary: conflict
            ? `${differences.length} difference(s) detected.`
            : "No differences detected.",
    };
}

/**
 * CLI usage:
 * node detect-conflicts.js local.json remote.json
 */
function main() {
    const [, , localPath, remotePath] = process.argv;

    if (!localPath || !remotePath) {
        console.error("Usage: node detect-conflicts.js <local.json> <remote.json>");
        process.exit(1);
    }

    try {
        const localRecord = readJsonFile(localPath);
        const remoteRecord = readJsonFile(remotePath);

        const result = detectConflicts(localRecord, remoteRecord);

        console.log(JSON.stringify(result, null, 2));
        process.exit(result.conflict ? 2 : 0);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = {
    detectConflicts,
    compareValues,
};