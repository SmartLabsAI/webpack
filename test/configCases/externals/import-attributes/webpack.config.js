const path = require("path");
const fs = require("fs");
const {
	Compilation,
	sources: { OriginalSource }
} = require("../../../../");

/** @type {import("../../../../").Configuration} */
module.exports = {
	output: {
		library: {
			type: "module"
		}
	},
	target: ["web", "es2020"],
	experiments: {
		outputModule: true
	},
	plugins: [
		{
			apply(compiler) {
				compiler.hooks.compilation.tap("html-plugin", compilation => {
					compilation.hooks.processAssets.tap(
						{
							name: "copy-plugin",
							stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL
						},
						() => {
							[
								"static-package.json",
								"static-package-str.json",
								"dynamic-package.json",
								"dynamic-package-str.json"
							].forEach(filename => {
								const resolvedFilename = path.resolve(__dirname, filename);
								const content = fs.readFileSync(resolvedFilename);
								compilation.emitAsset(filename, new OriginalSource(content));
							});
						}
					);
				});
			}
		}
	],
	externals: {
		"./static-package.json": "module ./static-package.json",
		"./static-package-str.json": "module ./static-package-str.json",
		"./dynamic-package.json": "import ./dynamic-package.json",
		"./dynamic-package-str.json": "import ./dynamic-package-str.json"
	}
};
