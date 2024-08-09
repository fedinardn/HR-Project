"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFile = getFile;
exports.getApiResponse = getApiResponse;
const fs_1 = require("fs");
const path_1 = require("path");
function getFile(filePath, fileName) {
  const file = (0, path_1.join)(filePath, fileName);
  if (!(0, fs_1.existsSync)(file)) {
    console.log(`File not found: ${file}`);
    return "";
  }
  return (0, fs_1.readFileSync)(file, "utf8");
}
function getApiResponse(message, status, data = null) {
  const apiResponse = {
    status: status,
    message: message,
    data: data,
  };
  return apiResponse;
}
//# sourceMappingURL=utils.js.map
