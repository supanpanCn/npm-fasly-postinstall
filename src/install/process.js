function onProcessCallback(ctx) {
  process.on("exit", () => {
    const {
      server,
      PM,
      _npm_postintall_throw_err
    } = ctx.config || {};
    if (server !== "install") return;
    const {
      resolves,
      root,
      sep,
      useredPkgVestigital
    } = ctx.const
    const {
      copy,
      exists,
      unlink,
      writeJson
    } = ctx.fs
    const npminstall_err_path = resolves.get("npminstall_err_path");
    if (
      _npm_postintall_throw_err &&
      exists(npminstall_err_path)
    ) {
      ctx.utils.log("EXIT");
      return;
    }
    // remove
    const dynamic_path = resolves.get("dynamic_path");
    const removes = Object.keys(useredPkgVestigital)
      .filter(v => v !== PM && !v.includes("lock"))
      .map((v) => dynamic_path(root + sep + useredPkgVestigital[v]));
    removes.push(npminstall_err_path);
    removes.push(resolves.get('pnpm_err_path'));
    removes.forEach((v) => {
      exists(v) && unlink(v);
    });

    // cache
    const pkg_path = resolves.get("pkg_path");
    exists(pkg_path) && copy(pkg_path, resolves.get("copy_path"));
    writeJson(resolves.get("config_path"), ctx.config, {
      spaces: '\t'
    });
  });
}
module.exports = {
  onProcessCallback,
};