/* eslint-env browser */
import path from "path";

import MiniCssExtractPlugin from "../src/cjs";

import {
  compile,
  getCompiler,
  getErrors,
  getWarnings,
  runInJsDom,
} from "./helpers/index";

describe("noRuntime option", () => {
  it(`should work without noRuntime option`, async () => {
    const compiler = getCompiler(
      "attributes.js",
      {},
      {
        output: {
          publicPath: "",
          path: path.resolve(__dirname, "../outputs"),
          filename: "[name].bundle.js",
        },
        plugins: [
          new MiniCssExtractPlugin({
            filename: "[name].css",
          }),
        ],
      }
    );
    const stats = await compile(compiler);

    runInJsDom("main.bundle.js", compiler, stats, (dom, bundle) => {
      expect(dom.serialize()).toMatchSnapshot("DOM");
      expect(bundle).toContain("webpack/runtime/css loading");
      expect(bundle).toContain("webpack/runtime/get mini-css chunk filename");
    });

    expect(getWarnings(stats)).toMatchSnapshot("warnings");
    expect(getErrors(stats)).toMatchSnapshot("errors");
  });

  it(`should work when noRuntime option is "false"`, async () => {
    const compiler = getCompiler(
      "attributes.js",
      {},
      {
        output: {
          publicPath: "",
          path: path.resolve(__dirname, "../outputs"),
          filename: "[name].bundle.js",
        },
        plugins: [
          new MiniCssExtractPlugin({
            noRuntime: false,
            filename: "[name].css",
          }),
        ],
      }
    );
    const stats = await compile(compiler);

    runInJsDom("main.bundle.js", compiler, stats, (dom, bundle) => {
      expect(dom.serialize()).toMatchSnapshot("DOM");
      expect(bundle).toContain("webpack/runtime/css loading");
      expect(bundle).toContain("webpack/runtime/get mini-css chunk filename");
    });

    expect(getWarnings(stats)).toMatchSnapshot("warnings");
    expect(getErrors(stats)).toMatchSnapshot("errors");
  });

  it(`should work when noRuntime option is "true"`, async () => {
    const compiler = getCompiler(
      "attributes.js",
      {},
      {
        output: {
          publicPath: "",
          path: path.resolve(__dirname, "../outputs"),
          filename: "[name].bundle.js",
        },
        plugins: [
          new MiniCssExtractPlugin({
            noRuntime: true,
            filename: "[name].css",
          }),
        ],
      }
    );
    const stats = await compile(compiler);

    runInJsDom("main.bundle.js", compiler, stats, (dom, bundle) => {
      expect(dom.serialize()).toMatchSnapshot("DOM");
      expect(bundle).not.toContain("webpack/runtime/css loading");
      expect(bundle).not.toContain(
        "webpack/runtime/get mini-css chunk filename"
      );
    });

    expect(getWarnings(stats)).toMatchSnapshot("warnings");
    expect(getErrors(stats)).toMatchSnapshot("errors");
  });
});
