const id='b588708731fda94f8df65f771213e8a5ae2c97c11e10ecc077cfb69685a360d2';
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
for (var name in all)
__defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
if (from && typeof from === "object" || typeof from === "function") {
for (let key of __getOwnPropNames(from))
if (!__hasOwnProp.call(to, key) && key !== except)
__defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
}
return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

var main_exports = {};
__export(main_exports, {
default: () => SmartSourcesPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian14 = require("obsidian");

var import_obsidian11 = require("obsidian");

async function build_html(env, opts = {}) {
const env_settings_html = Object.entries(env.settings_config).map(([setting_key, setting_config]) => {
if (!setting_config.setting)
setting_config.setting = setting_key;
return this.render_setting_html(setting_config);
}).join("\n");
const env_collections_containers_html = Object.entries(env.collections).map(([collection_key, collection]) => {
return `<div data-smart-settings="${collection_key}"></div>`;
}).join("\n");
const html = `
<div class="">
${env_settings_html}
${env_collections_containers_html}
</div>
`;
return html;
}
async function render(env, opts = {}) {
const html = await build_html.call(this, env, opts);
const frag = this.create_doc_fragment(html);
return await post_process.call(this, env, frag, opts);
}
async function post_process(env, frag, opts = {}) {
await this.render_setting_components(frag, { scope: env });
const env_collections_containers = frag.querySelectorAll("[data-smart-settings]");
for (const env_collections_container of env_collections_containers) {
const collection_key = env_collections_container.dataset.smartSettings;
const collection = env[collection_key];
await collection.render_settings(env_collections_container);
}
return frag;
}

var SmartSettings = class {
/**
* Creates an instance of SmartEnvSettings.
* @param {Object} main - The main object to contain the instance (smart_settings) and getter (settings)
* @param {Object} [opts={}] - Configuration options.
*/
constructor(main, opts = {}) {
this.main = main;
this.opts = opts;
this._fs = null;
this._settings = {};
this._saved = false;
this.save_timeout = null;
}
static async create(main, opts = {}) {
const smart_settings = new this(main, opts);
await smart_settings.load();
main.smart_settings = smart_settings;
Object.defineProperty(main, "settings", {
get() {
return smart_settings.settings;
},
set(settings) {
smart_settings.settings = settings;
}
});
return smart_settings;
}
static create_sync(main, opts = {}) {
const smart_settings = new this(main, opts);
smart_settings.load_sync();
main.smart_settings = smart_settings;
Object.defineProperty(main, "settings", {
get() {
return smart_settings.settings;
},
set(settings) {
smart_settings.settings = settings;
}
});
return smart_settings;
}
/**
* Gets the current settings, wrapped with an observer to handle changes.
* @returns {Proxy} A proxy object that observes changes to the settings.
*/
get settings() {
return observe_object(this._settings, (property, value, target) => {
if (this.save_timeout)
clearTimeout(this.save_timeout);
this.save_timeout = setTimeout(() => {
this.save(this._settings);
this.save_timeout = null;
}, 1e3);
});
}
/**
* Sets the current settings.
* @param {Object} settings - The new settings to apply.
*/
set settings(settings) {
this._settings = settings;
}
async save(settings = this._settings) {
if (typeof this.opts.save === "function")
await this.opts.save(settings);
else
await this.main.save_settings(settings);
}
async load() {
if (typeof this.opts.load === "function")
this._settings = await this.opts.load();
else
this._settings = await this.main.load_settings();
}
load_sync() {
if (typeof this.opts.load === "function")
this._settings = this.opts.load();
else
this._settings = this.main.load_settings();
}
};
function observe_object(obj, on_change) {
function create_proxy(target) {
return new Proxy(target, {
set(target2, property, value) {
if (target2[property] !== value) {
target2[property] = value;
on_change(property, value, target2);
}
if (typeof value === "object" && value !== null) {
target2[property] = create_proxy(value);
}
return true;
},
get(target2, property) {
const result = target2[property];
if (typeof result === "object" && result !== null) {
return create_proxy(result);
}
return result;
},
deleteProperty(target2, property) {
if (property in target2) {
delete target2[property];
on_change(property, void 0, target2);
}
return true;
}
});
}
return create_proxy(obj);
}

function is_plain_object(o) {
if (o === null)
return false;
if (typeof o !== "object")
return false;
if (Array.isArray(o))
return false;
if (o instanceof Function)
return false;
if (o instanceof Date)
return false;
return Object.getPrototypeOf(o) === Object.prototype;
}

function deep_merge(target, source) {
for (const key in source) {
if (!Object.prototype.hasOwnProperty.call(source, key))
continue;
if (is_plain_object(source[key]) && is_plain_object(target[key])) {
deep_merge(target[key], source[key]);
} else {
target[key] = source[key];
}
}
return target;
}

function camel_case_to_snake_case(str) {
const result = str.replace(/([A-Z])/g, (match) => `_${match.toLowerCase()}`).replace(/^_/, "").replace(/2$/, "");
return result;
}

function normalize_opts(opts) {
if (!opts.collections)
opts.collections = {};
if (!opts.modules)
opts.modules = {};
if (!opts.items)
opts.items = {};
Object.entries(opts.collections).forEach(([key, val]) => {
if (typeof val === "function") {
opts.collections[key] = { class: val };
}
const new_key = camel_case_to_snake_case(key);
if (new_key !== key) {
opts.collections[new_key] = opts.collections[key];
delete opts.collections[key];
}
if (!opts.collections[new_key].collection_key)
opts.collections[new_key].collection_key = new_key;
if (val.item_type) {
opts.items[camel_case_to_snake_case(val.item_type.name)] = {
class: val.item_type
};
}
});
Object.entries(opts.modules).forEach(([key, val]) => {
if (typeof val === "function") {
opts.modules[key] = { class: val };
}
const new_key = camel_case_to_snake_case(key);
if (new_key !== key) {
opts.modules[new_key] = opts.modules[key];
delete opts.modules[key];
}
});
if (!opts.item_types)
opts.item_types = {};
if (!opts.items)
opts.items = {};
Object.entries(opts.item_types).forEach(([key, val]) => {
if (typeof val === "function") {
const new_key = camel_case_to_snake_case(key);
opts.items[new_key] = {
class: val,
actions: {},
...opts.items[new_key] || {}
};
}
});
return opts;
}

function is_plain_object2(value) {
if (!value || typeof value !== "object")
return false;
const proto = Object.getPrototypeOf(value);
return proto === Object.prototype || proto === null;
}
function deep_clone_config(input) {
if (Array.isArray(input)) {
return input.map((item) => deep_clone_config(item));
}
if (is_plain_object2(input)) {
const output = {};
for (const [k, v] of Object.entries(input)) {
output[k] = deep_clone_config(v);
}
return output;
}
return input;
}

function deep_merge_no_overwrite(target, source, path = []) {
if (!is_plain_object(target) || !is_plain_object(source)) {
return target;
}
if (path.includes(source)) {
return target;
}
path.push(source);
for (const key of Object.keys(source)) {
if (!Object.prototype.hasOwnProperty.call(source, key)) {
continue;
}
const val = source[key];
if (Array.isArray(target[key]) && Array.isArray(val)) {
target[key].push(...val);
} else if (is_plain_object(val)) {
if (!is_plain_object(target[key])) {
target[key] = {};
}
deep_merge_no_overwrite(target[key], val, [...path]);
} else if (!Object.prototype.hasOwnProperty.call(target, key)) {
target[key] = val;
}
}
return target;
}

function merge_env_config(target, incoming) {
for (const [key, value] of Object.entries(incoming)) {
if (typeof value === "object" && value !== null) {
if (Array.isArray(value)) {
target[key] = [...target[key] || [], ...value];
} else {
if (!target[key])
target[key] = {};
deep_merge_no_overwrite(target[key], value);
}
} else if (value !== target[key]) {
if (target[key] !== void 0) {
console.warn(
`SmartEnv: Overwriting existing property ${key} in smart_env_config`,
{ old: target[key], new: value }
);
}
target[key] = value;
}
}
return target;
}

var SmartEnv = class {
/**
* @type {number} version - Bump this number when shipping a new version of SmartEnv.
* If a newer version is loaded into a runtime that already has an older environment,
* an automatic reload of all existing mains will occur.
*/
static version = 2.1391099;
scope_name = "smart_env";
static global_ref = get_global_ref();
global_ref = this.constructor.global_ref;
constructor(opts = {}) {
this.state = "init";
this._components = {};
this.collections = {};
this.load_timeout = null;
if (opts.primary_main_key)
this.primary_main_key = opts.primary_main_key;
}
/**
* Returns the config object for the SmartEnv instance.
* @returns {Object} The config object.
*/
get config() {
if (!this._config) {
this._config = {};
const sorted_configs = Object.entries(this.smart_env_configs).sort(([main_key, { main, opts }]) => {
if (!this.primary_main_key)
return 0;
if (main_key === this.primary_main_key)
return -1;
return 0;
});
for (const [main_key, { main, opts }] of sorted_configs) {
if (!main) {
console.warn(`SmartEnv: '${main_key}' has been unloaded, skipping inclusion in smart_env`);
delete this.smart_env_configs[main_key];
continue;
}
merge_env_config(
this._config,
deep_clone_config(
normalize_opts(opts)
)
);
}
}
return this._config;
}
get env_start_wait_time() {
if (typeof this.config.env_start_wait_time === "number")
return this.config.env_start_wait_time;
return 5e3;
}
static get global_env() {
return this.global_ref.smart_env;
}
static set global_env(env) {
this.global_ref.smart_env = env;
}
static get mains() {
return Object.keys(this.global_ref.smart_env_configs || {});
}
get mains() {
return Object.keys(this.global_ref.smart_env_configs || {});
}
static get should_reload() {
if (!this.global_env)
return true;
if (this.global_env.state === "loaded")
return true;
if (typeof this.global_env?.constructor?.version === "undefined")
return true;
if (this.global_env.constructor.version < this.version) {
console.warn(
"SmartEnv: Reloading environment because of version mismatch",
`${this.version} > ${this.global_env.constructor.version}`
);
return true;
}
return false;
}
static get smart_env_configs() {
if (!this.global_ref.smart_env_configs)
this.global_ref.smart_env_configs = {};
return this.global_ref.smart_env_configs;
}
get smart_env_configs() {
if (!this.global_ref.smart_env_configs)
this.global_ref.smart_env_configs = {};
return this.global_ref.smart_env_configs;
}
/**
* Waits for either a specific main to be registered in the environment,
* or (if `opts.main` is not specified) waits for environment collections to load.
* @param {object} opts
* @param {object} [opts.main] - if set, the function waits until that main is found.
* @returns {Promise<SmartEnv>} Resolves with the environment instance
*/
static wait_for(opts = {}) {
return new Promise((resolve) => {
if (opts.main) {
const interval = setInterval(() => {
if (this.global_env && this.global_env[opts.main]) {
clearInterval(interval);
resolve(this.global_env);
}
}, 1e3);
} else {
const interval = setInterval(() => {
if (this.global_env && this.global_env.state === "loaded") {
clearInterval(interval);
resolve(this.global_env);
}
}, 100);
}
});
}
/**
* Creates or updates a SmartEnv instance.
* - If a global environment exists and is an older version or lacks 'init_main', it is replaced.
* @param {Object} main - The main object to be added to the SmartEnv instance.
* @param {Object} [main_env_opts={}] - Options for configuring the SmartEnv instance.
* @returns {SmartEnv} The SmartEnv instance.
* @throws {TypeError} If an invalid main object is provided.
* @throws {Error} If there's an error creating or updating the SmartEnv instance.
*/
static async create(main, main_env_opts = null) {
if (!main || typeof main !== "object") {
throw new TypeError("SmartEnv: Invalid main object provided");
}
if (!main_env_opts) {
if (!main.smart_env_config) {
throw new Error("SmartEnv: No main_env_opts or main.smart_env_config provided");
}
main_env_opts = main.smart_env_config;
}
this.add_main(main, main_env_opts);
if (this.should_reload) {
const opts = {};
if (this.global_env && this.version > (this.global_env.constructor?.version || 0)) {
opts.primary_main_key = camel_case_to_snake_case(main.constructor.name);
}
if (this.global_env?.load_timeout)
clearTimeout(this.global_env.load_timeout);
this.global_env = new this(opts);
if (!window.all_envs)
window.all_envs = [];
window.all_envs.push(this.global_env);
}
clearTimeout(this.global_env.load_timeout);
this.global_env.load_timeout = setTimeout(async () => {
await this.global_env.load();
this.global_env.load_timeout = null;
}, this.global_env.env_start_wait_time);
return this.global_env;
}
static add_main(main, main_env_opts = null) {
if (this.global_env?._config)
this.global_env._config = null;
const main_key = camel_case_to_snake_case(main.constructor.name);
this.smart_env_configs[main_key] = { main, opts: main_env_opts };
this.create_env_getter(main);
}
/**
* Creates a dynamic environment getter on any instance object.
* The returned 'env' property will yield the global `smart_env`.
* @param {Object} instance_to_receive_getter
*/
static create_env_getter(instance_to_receive_getter) {
Object.defineProperty(instance_to_receive_getter, "env", {
get: () => this.global_env
});
}
create_env_getter(instance_to_receive_getter) {
this.constructor.create_env_getter(instance_to_receive_getter);
}
async load() {
await this.fs.load_files();
if (!this.settings)
await SmartSettings.create(this);
if (this.config.default_settings) {
deep_merge_no_overwrite(this.settings, this.config.default_settings);
}
await this.init_collections();
for (const [main_key, { main, opts }] of Object.entries(this.smart_env_configs)) {
this[main_key] = main;
await this.ready_to_load_collections(main);
}
await this.load_collections();
this.state = "loaded";
}
/**
* Initializes collection classes if they have an 'init' function.
* @param {Object} [config=this.config]
*/
async init_collections(config = this.config) {
for (const key of Object.keys(config.collections || {})) {
const _class = config.collections[key]?.class;
if (!_class)
continue;
if (_class.default_settings) {
deep_merge_no_overwrite(
this.settings,
{
[key]: _class.default_settings
}
);
}
if (typeof _class.init !== "function")
continue;
await _class.init(this, { ...config.collections[key] });
this.collections[key] = "init";
}
}
/**
* Hook for main classes that optionally implement `ready_to_load_collections()`.
* @param {Object} main
*/
async ready_to_load_collections(main) {
if (typeof main?.ready_to_load_collections === "function") {
await main.ready_to_load_collections();
}
return true;
}
/**
* Loads any available collections, processing their load queues.
* @param {Object} [collections=this.collections] - Key-value map of collection instances.
*/
async load_collections(collections = this.collections) {
for (const key of Object.keys(collections || {})) {
const time_start = Date.now();
if (typeof this[key]?.process_load_queue === "function") {
if (this.state === "init" && this[key].opts?.prevent_load_on_init === true)
continue;
await this[key].process_load_queue();
}
this.collections[key] = "loaded";
this[key].load_time_ms = Date.now() - time_start;
}
}
/**
* Removes a main from the window.smart_env_configs to exclude it on reload
* @param {Class} main
* @param {Object|null} [unload_config=null]
*/
static unload_main(main) {
const main_key = camel_case_to_snake_case(main.constructor.name);
this.smart_env_configs[main_key] = null;
delete this.smart_env_configs[main_key];
}
unload_main(main) {
this.constructor.unload_main(main);
}
/**
* Triggers a save event in all known collections.
*/
save() {
for (const key of Object.keys(this.collections)) {
this[key].process_save_queue?.();
}
}
/**
* Initialize a module from the configured `this.opts.modules`.
* @param {string} module_key
* @param {object} opts
* @returns {object|null} instance of the requested module or null if not found
*/
init_module(module_key, opts = {}) {
const module_config = this.opts.modules[module_key];
if (!module_config) {
return console.warn(`SmartEnv: module ${module_key} not found`);
}
opts = {
...{ ...module_config, class: null },
...opts
};
return new module_config.class(opts);
}
get notices() {
if (!this._notices) {
const SmartNoticesClass = this.config.modules.smart_notices.class;
this._notices = new SmartNoticesClass(this, {
adapter: this.config.modules.smart_notices.adapter
});
}
return this._notices;
}
/**
* Exposes a settings template function from environment opts or defaults.
* @returns {Function}
*/
get settings_template() {
return this.opts.components?.smart_env?.settings || render;
}
/**
* Renders settings UI into a container, using the environment's `settings_template`.
* @param {HTMLElement} [container=this.settings_container]
*/
async render_settings(container = this.settings_container) {
if (!this.settings_container || container !== this.settings_container) {
this.settings_container = container;
}
if (!container) {
throw new Error("Container is required");
}
const frag = await this.render_component("settings", this, {});
container.innerHTML = "";
container.appendChild(frag);
return frag;
}
/**
* Renders a named component using an optional scope and options.
* @param {string} component_key
* @param {Object} scope
* @param {Object} [opts]
* @returns {Promise<HTMLElement>}
*/
async render_component(component_key, scope, opts = {}) {
const component_renderer = this.get_component(component_key, scope);
if (!component_renderer) {
console.warn(`SmartEnv: component ${component_key} not found for scope ${scope.constructor.name}`);
return this.smart_view.create_doc_fragment(`<div class="smart-env-component-not-found">
<h1>Component Not Found</h1>
<p>The component ${component_key} was not found for scope ${scope.constructor.name}.</p>
</div>`);
}
const frag = await component_renderer(scope, opts);
return frag;
}
/**
* Retrieves or creates a memoized component renderer function.
* @param {string} component_key
* @param {Object} scope
* @returns {Function|undefined}
*/
get_component(component_key, scope) {
const scope_name = scope.collection_key ?? scope.scope_name;
const _cache_key = scope_name ? `${scope_name}-${component_key}` : component_key;
if (!this._components[_cache_key]) {
try {
if (this.opts.components[scope_name]?.[component_key]) {
this._components[_cache_key] = this.opts.components[scope_name][component_key].bind(
this.init_module("smart_view")
);
} else if (this.opts.components[component_key]) {
this._components[_cache_key] = this.opts.components[component_key].bind(
this.init_module("smart_view")
);
} else {
console.warn(
`SmartEnv: component ${component_key} not found for scope ${scope_name}`
);
}
} catch (e) {
console.error("Error getting component", e);
console.log(
`scope_name: ${scope_name}; component_key: ${component_key}; this.opts.components: ${Object.keys(
this.opts.components || {}
).join(", ")}; this.opts.components[scope_name]: ${Object.keys(
this.opts.components[scope_name] || {}
).join(", ")}`
);
}
}
return this._components[_cache_key];
}
/**
* Lazily instantiate the module 'smart_view'.
* @returns {object}
*/
get smart_view() {
if (!this._smart_view) {
this._smart_view = this.init_module("smart_view");
}
return this._smart_view;
}
/**
* A built-in settings schema for this environment.
* @returns {Object}
*/
get settings_config() {
return {
is_obsidian_vault: {
name: "Obsidian Vault",
description: "Toggle on if this is an Obsidian vault.",
type: "toggle",
default: false
},
file_exclusions: {
name: "File Exclusions",
description: "Comma-separated list of files to exclude.",
type: "text",
default: "",
callback: "update_exclusions"
},
folder_exclusions: {
name: "Folder Exclusions",
description: "Comma-separated list of folders to exclude.",
type: "text",
default: "",
callback: "update_exclusions"
},
excluded_headings: {
name: "Excluded Headings",
description: "Comma-separated list of headings to exclude. Note: currently only applies to blocks (2025-04-07).",
type: "text",
default: ""
}
};
}
get global_prop() {
return this.opts.global_prop ?? "smart_env";
}
get item_types() {
return this.opts.item_types;
}
get fs_module_config() {
return this.opts.modules.smart_fs;
}
get fs() {
if (!this.smart_fs) {
this.smart_fs = new this.fs_module_config.class(this, {
adapter: this.fs_module_config.adapter,
fs_path: this.opts.env_path || ""
});
}
return this.smart_fs;
}
get env_data_dir() {
const env_settings_files = this.fs.file_paths?.filter((path) => path.endsWith("smart_env.json")) || [];
let env_data_dir = ".smart-env";
if (env_settings_files.length > 0) {
if (env_settings_files.length > 1) {
const env_data_dir_counts = env_settings_files.map((path) => {
const dir = path.split("/").slice(-2, -1)[0];
return {
dir,
count: this.fs.file_paths.filter((p) => p.includes(dir)).length
};
});
env_data_dir = env_data_dir_counts.reduce(
(max, dirObj) => dirObj.count > max.count ? dirObj : max,
env_data_dir_counts[0]
).dir;
} else {
env_data_dir = env_settings_files[0].split("/").slice(-2, -1)[0];
}
}
return env_data_dir;
}
get data_fs() {
if (!this._fs) {
this._fs = new this.fs_module_config.class(this, {
adapter: this.fs_module_config.adapter,
fs_path: this.data_fs_path
});
}
return this._fs;
}
get data_fs_path() {
if (!this._data_fs_path) {
this._data_fs_path = (this.opts.env_path + (this.opts.env_path ? this.opts.env_path.includes("\\") ? "\\" : "/" : "") + this.env_data_dir).replace(/\\\\/g, "\\").replace(/\/\//g, "/");
}
return this._data_fs_path;
}
/**
* Saves the current settings to the file system.
* @param {Object|null} [settings=null] - Optional settings to override the current settings before saving.
* @returns {Promise<void>}
*/
async save_settings(settings) {
this._saved = false;
if (!await this.data_fs.exists("")) {
await this.data_fs.mkdir("");
}
await this.data_fs.write("smart_env.json", JSON.stringify(settings, null, 2));
this._saved = true;
}
/**
* Loads settings from the file system, merging with any `default_settings` or `smart_env_settings`.
* @returns {Promise<Object>} the loaded settings
*/
async load_settings() {
if (!await this.data_fs.exists("smart_env.json"))
await this.save_settings({});
let settings = JSON.parse(JSON.stringify(this.config.default_settings || {}));
deep_merge(settings, JSON.parse(await this.data_fs.read("smart_env.json")));
deep_merge(settings, this.opts?.smart_env_settings || {});
this._saved = true;
if (this.fs.auto_excluded_files) {
const existing_file_exclusions = settings.file_exclusions.split(",").map((s) => s.trim()).filter(Boolean);
settings.file_exclusions = [...existing_file_exclusions, ...this.fs.auto_excluded_files].filter((value, index, self) => self.indexOf(value) === index).join(",");
}
return settings;
}
/**
* Refreshes file-system state if exclusions changed,
* then re-renders relevant settings UI
*/
async update_exclusions() {
this.smart_sources._fs = null;
await this.smart_sources.fs.init();
}
/** @deprecated access `this.state` and `collection.state` directly instead */
get collections_loaded() {
return this.state === "loaded";
}
/** @deprecated Use this['main_class_name'] instead of this.main/this.plugin */
get main() {
return this.smart_env_configs[this.mains[0]]?.main;
}
/**
* @deprecated use component pattern instead
*/
get ejs() {
return this.opts.ejs;
}
/**
* @deprecated use component pattern instead
*/
get templates() {
return this.opts.templates;
}
/**
* @deprecated use component pattern instead
*/
get views() {
return this.opts.views;
}
/**
* @deprecated use this.config instead
*/
get opts() {
return this.config;
}
/**
* @deprecated Use this.main_class_name instead of this.plugin
*/
get plugin() {
return this.main;
}
};
function get_global_ref() {
if (typeof document !== "undefined" && document.window) {
console.log("using document.window");
return document.window;
}
if (typeof window !== "undefined") {
console.log("using window");
return window;
}
if (typeof global?.window !== "undefined") {
console.log("using global.window");
return global.window;
}
console.log("using global");
return global;
}

function create_regex(pattern, { case_sensitive, extended_glob, windows_paths }) {
const regex_pattern = glob_to_regex_pattern(pattern, extended_glob);
const adjusted_pattern = adjust_for_windows_paths(regex_pattern, windows_paths);
const flags = case_sensitive ? "" : "i";
return new RegExp(`^${adjusted_pattern}$`, flags);
}
function adjust_for_windows_paths(pattern, windows_paths) {
return windows_paths ? pattern.replace(/\\\//g, "[\\\\/]").replace(/\\\\\\/g, "[\\\\/]") : pattern;
}
function glob_to_regex_pattern(pattern, extended_glob) {
let in_class = false;
let in_brace = 0;
let result = "";
for (let i = 0; i < pattern.length; i++) {
const char = pattern[i];
switch (char) {
case "\\":
if (i + 1 < pattern.length) {
result += `\\${pattern[i + 1]}`;
i++;
} else {
result += "\\\\";
}
break;
case "/":
result += "\\/";
break;
case "[":
if (!in_class) {
const closingIndex = pattern.indexOf("]", i + 1);
if (closingIndex === -1) {
result += "\\[";
} else {
in_class = true;
if (pattern[i + 1] === "!") {
result += "[^";
i++;
} else {
result += "[";
}
}
} else {
result += "\\[";
}
break;
case "]":
if (in_class) {
in_class = false;
result += "]";
} else {
result += "\\]";
}
break;
case "{":
if (!in_class) {
in_brace++;
result += "(";
} else {
result += "\\{";
}
break;
case "}":
if (!in_class && in_brace > 0) {
in_brace--;
result += ")";
} else {
result += "\\}";
}
break;
case ",":
if (!in_class && in_brace > 0) {
result += "|";
} else {
result += ",";
}
break;
case "*":
if (!in_class) {
if (i + 1 < pattern.length && pattern[i + 1] === "*") {
result += ".*";
i++;
} else {
result += "[^/]*";
}
} else {
result += "\\*";
}
break;
case "?":
if (!in_class) {
result += "[^/]";
} else {
result += "\\?";
}
break;
case "(":
case ")":
case "+":
case "|":
case "^":
case "$":
case ".":
result += `\\${char}`;
break;
default:
result += char;
break;
}
}
if (in_class) {
result += "]";
in_class = false;
}
if (extended_glob) {
result = result.replace(/\\\+\\\((.*?)\\\)/g, "($1)+").replace(/\\\@\\\((.*?)\\\)/g, "($1)").replace(/\\\!\\\((.*?)\\\)/g, "(?!$1).*").replace(/\\\?\\\((.*?)\\\)/g, "($1)?").replace(/\\\*\\\((.*?)\\\)/g, "($1)*");
}
return result;
}
function glob_to_regex(pattern, options = {}) {
const default_options = {
case_sensitive: true,
extended_glob: false,
windows_paths: false
};
const merged_options = { ...default_options, ...options };
if (pattern === "") {
return /^$/;
}
if (pattern === "*" && !merged_options.windows_paths) {
return /^[^/]+$/;
}
if (pattern === "**" && !merged_options.windows_paths) {
return /^.+$/;
}
return create_regex(pattern, merged_options);
}

function fuzzy_search(arr, search_term) {
let matches = [];
for (let i = 0; i < arr.length; i++) {
const search_chars = search_term.toLowerCase().split("");
let match = true;
let distance = 0;
const name = arr[i];
const label_name = name.toLowerCase();
for (let j = 0; j < search_chars.length; j++) {
const search_index = label_name.substring(distance).indexOf(search_chars[j]);
if (search_index >= 0) {
distance += search_index + 1;
} else {
match = false;
break;
}
}
if (match)
matches.push({ name, distance });
}
matches.sort((a, b) => a.distance - b.distance);
return matches.map((match) => match.name);
}

var SmartFs = class {
/**
* Create a new SmartFs instance
*
* @param {Object} env - The Smart Environment instance
* @param {Object} [opts={}] - Optional configuration
* @param {string} [opts.fs_path] - Custom environment path
*/
constructor(env, opts = {}) {
this.env = env;
this.opts = opts;
this.fs_path = opts.fs_path || opts.env_path || "";
if (!opts.adapter)
throw new Error("SmartFs requires an adapter");
this.adapter = new opts.adapter(this);
this.excluded_patterns = [];
if (Array.isArray(opts.exclude_patterns)) {
opts.exclude_patterns.forEach((pattern) => this.add_ignore_pattern(pattern));
}
this.folders = {};
this.files = {};
this.file_paths = [];
this.folder_paths = [];
this.auto_excluded_files = [];
}
async refresh() {
this.files = {};
this.file_paths = [];
this.folders = {};
this.folder_paths = [];
await this.init();
}
async init() {
await this.load_gitignore();
await this.load_files();
}
async load_files() {
const all = await this.list_recursive();
this.file_paths = [];
this.folder_paths = [];
all.forEach((file) => {
if (file.type === "file") {
this.files[file.path] = file;
this.file_paths.push(file.path);
} else if (file.type === "folder") {
this.folders[file.path] = file;
this.folder_paths.push(file.path);
}
});
}
include_file(file_path) {
const file = this.adapter.get_file(file_path);
this.files[file.path] = file;
this.file_paths.push(file.path);
return file;
}
/**
* Load .gitignore patterns
*
* @returns {Promise<RegExp[]>} Array of RegExp patterns
*/
async load_gitignore() {
const gitignore_path = ".gitignore";
const gitignore_exists = await this.adapter.exists(gitignore_path);
if (gitignore_exists) {
const gitignore_content = await this.adapter.read(gitignore_path, "utf-8");
gitignore_content.split("\n").filter((line) => !line.startsWith("#")).filter(Boolean).forEach((pattern) => this.add_ignore_pattern(pattern));
}
this.add_ignore_pattern(".**");
this.add_ignore_pattern("**/.**");
this.add_ignore_pattern("**/.*/**");
this.add_ignore_pattern("**/*.ajson");
this.add_ignore_pattern("**/*.excalidraw.md");
}
/**
* Add a new ignore pattern
*
* @param {string} pattern - The pattern to add
*/
add_ignore_pattern(pattern, opts = {}) {
this.excluded_patterns.push(glob_to_regex(pattern.trim(), opts));
}
/**
* Check if a path is ignored based on gitignore patterns
*
* @param {string} _path - The path to check
* @returns {boolean} True if the path is ignored, false otherwise
*/
is_excluded(_path) {
try {
if (_path.includes("#"))
return true;
if (!this.excluded_patterns.length)
return false;
return this.excluded_patterns.some((pattern) => pattern.test(_path));
} catch (e) {
console.error(`Error checking if path is excluded: ${e.message}`);
console.error(`Path: `, _path);
throw e;
}
}
/**
* Check if any path in an array of paths is excluded
*
* @param {string[]} paths - Array of paths to check
* @returns {boolean} True if any path is excluded, false otherwise
*/
has_excluded_patterns(paths) {
return paths.some((p) => this.is_excluded(p));
}
/**
* Pre-process an array of paths, throwing an error if any path is excluded
*
* @param {string[]} paths - Array of paths to pre-process
* @throws {Error} If any path in the array is excluded
* @returns {string[]} The array of paths
*/
pre_process(paths) {
if (this.has_excluded_patterns(paths)) {
throw new Error(`Path is excluded: ${paths.find((p) => this.is_excluded(p))}`);
}
return paths;
}
/**
* Post-process the result of an operation
*
* @param {any} returned_value - The value returned by the operation
* @returns {any} The post-processed value
*/
post_process(returned_value) {
if (this.adapter.post_process)
return this.adapter.post_process(returned_value);
if (Array.isArray(returned_value)) {
returned_value = returned_value.filter((r) => {
if (typeof r === "string")
return !this.is_excluded(r);
if (typeof r === "object" && r.path)
return !this.is_excluded(r.path);
return true;
});
}
return returned_value;
}
/**
* Use the adapter for a method
* runs pre_process and post_process (checks exclusions)
* @param {string} method - The method to use
* @param {string[]} paths - The paths to use
* @param {...any} args - Additional arguments for the method
* @returns {Promise<any>} The result of the method
*/
async use_adapter(method, paths, ...args) {
if (!this.adapter[method])
throw new Error(`Method ${method} not found in adapter`);
paths = this.pre_process(paths ?? []);
let resp = await this.adapter[method](...paths, ...args);
return this.post_process(resp);
}
/**
* Append content to a file
*
* @param {string} rel_path - The relative path of the file to append to
* @param {string|Buffer} content - The content to append
* @returns {Promise<void>} A promise that resolves when the operation is complete
*/
async append(rel_path, content) {
return await this.use_adapter("append", [rel_path], content);
}
/**
* Create a new directory
*
* @param {string} rel_path - The relative path of the directory to create
* @returns {Promise<void>} A promise that resolves when the operation is complete
*/
async mkdir(rel_path, opts = { recursive: true }) {
return await this.use_adapter("mkdir", [rel_path], opts);
}
/**
* Check if a file or directory exists
*
* @param {string} rel_path - The relative path to check
* @returns {Promise<boolean>} True if the path exists, false otherwise
*/
async exists(rel_path) {
return await this.use_adapter("exists", [rel_path]);
}
/**
* List files in a directory
*
* @param {string} rel_path - The relative path to list
* @returns {Promise<string[]>} Array of file paths
*/
async list(rel_path = "/") {
return await this.use_adapter("list", [rel_path]);
}
async list_recursive(rel_path = "/") {
return await this.use_adapter("list_recursive", [rel_path]);
}
async list_files(rel_path = "/") {
return await this.use_adapter("list_files", [rel_path]);
}
async list_files_recursive(rel_path = "/") {
return await this.use_adapter("list_files_recursive", [rel_path]);
}
async list_folders(rel_path = "/") {
return await this.use_adapter("list_folders", [rel_path]);
}
async list_folders_recursive(rel_path = "/") {
return await this.use_adapter("list_folders_recursive", [rel_path]);
}
/**
* Read the contents of a file
*
* @param {string} rel_path - The relative path of the file to read
* @returns {Promise<string|Buffer>} The contents of the file
*/
async read(rel_path, encoding = "utf-8") {
try {
const content = await this.adapter.read(rel_path, encoding);
return content;
} catch (error) {
console.warn("Error during read: " + error.message, rel_path);
if (error.code === "ENOENT")
return null;
return { error: error.message };
}
}
/**
* Remove a file
*
* @param {string} rel_path - The relative path of the file to remove
* @returns {Promise<void>} A promise that resolves when the operation is complete
*/
async remove(rel_path) {
return await this.use_adapter("remove", [rel_path]);
}
/**
* Remove a directory
*
* @param {string} rel_path - The relative path of the directory to remove
* @returns {Promise<void>} A promise that resolves when the operation is complete
*/
async remove_dir(rel_path, recursive = false) {
return await this.use_adapter("remove_dir", [rel_path], recursive);
}
/**
* Rename a file or directory
*
* @param {string} rel_path - The current relative path
* @param {string} new_rel_path - The new relative path
* @returns {Promise<void>} A promise that resolves when the operation is complete
*/
async rename(rel_path, new_rel_path) {
await this.use_adapter("rename", [rel_path, new_rel_path]);
await this.refresh();
}
/**
* Get file or directory statistics
*
* @param {string} rel_path - The relative path to get statistics for
* @returns {Promise<Object>} An object containing file or directory statistics
*/
async stat(rel_path) {
return await this.use_adapter("stat", [rel_path]);
}
/**
* Write content to a file
* Should handle when target path is within a folder that doesn't exist
*
* @param {string} rel_path - The relative path of the file to write to
* @param {string|Buffer} content - The content to write
* @returns {Promise<void>} A promise that resolves when the operation is complete
*/
async write(rel_path, content) {
try {
await this.adapter.write(rel_path, content);
} catch (error) {
console.error("Error during write:", error);
throw error;
}
}
get_link_target_path(link_target, source_path) {
if (this.adapter.get_link_target_path)
return this.adapter.get_link_target_path(link_target, source_path);
if (!this.file_paths)
return console.warn("get_link_target_path: file_paths not found");
const matching_file_paths = this.file_paths.filter((path) => path.includes(link_target));
return fuzzy_search(matching_file_paths, link_target)[0];
}
get sep() {
return this.adapter.sep || "/";
}
get_full_path(rel_path = "") {
return this.adapter.get_full_path(rel_path);
}
get base_path() {
return this.adapter.get_base_path();
}
};

var obsidian = __toESM(require("obsidian"), 1);
var SmartFsObsidianAdapter = class {
/**
* Create an SmartFsObsidianAdapter instance
*
* @param {Object} smart_fs - The SmartFs instance
*/
constructor(smart_fs) {
this.smart_fs = smart_fs;
this.obsidian = obsidian;
this.obsidian_app = smart_fs.env.main.app;
this.obsidian_adapter = smart_fs.env.main.app.vault.adapter;
}
get fs_path() {
return this.smart_fs.fs_path;
}
get_file(file_path) {
const file = {};
file.path = file_path.replace(/\\/g, "/").replace(this.smart_fs.fs_path, "").replace(/^\//, "");
file.type = "file";
file.extension = file.path.split(".").pop().toLowerCase();
file.name = file.path.split("/").pop();
file.basename = file.name.split(".").shift();
Object.defineProperty(file, "stat", {
get: () => {
const tfile = this.obsidian_app.vault.getAbstractFileByPath(file_path);
if (tfile) {
return {
ctime: tfile.stat.ctime,
mtime: tfile.stat.mtime,
size: tfile.stat.size,
isDirectory: () => tfile instanceof this.obsidian.TFolder,
isFile: () => tfile instanceof this.obsidian.TFile
};
}
return null;
}
});
return file;
}
/**
* Append content to a file
*
* @param {string} rel_path - The relative path of the file to append to
* @param {string} data - The content to append
* @returns {Promise<void>} A promise that resolves when the operation is complete
*/
async append(rel_path, data) {
if (!rel_path.startsWith(this.fs_path))
rel_path = this.fs_path + "/" + rel_path;
return await this.obsidian_adapter.append(rel_path, data);
}
/**
* Create a new directory
*
* @param {string} rel_path - The relative path of the directory to create
* @returns {Promise<void>} A promise that resolves when the operation is complete
*/
async mkdir(rel_path) {
if (!rel_path.startsWith(this.fs_path))
rel_path = this.fs_path + "/" + rel_path;
return await this.obsidian_adapter.mkdir(rel_path);
}
/**
* Check if a file or directory exists
*
* @param {string} rel_path - The relative path to check
* @returns {Promise<boolean>} True if the path exists, false otherwise
*/
async exists(rel_path) {
if (!rel_path.startsWith(this.fs_path))
rel_path = this.fs_path + "/" + rel_path;
return await this.obsidian_adapter.exists(rel_path);
}
/**
* List files in a directory (NOT up-to-date with list_recursive)
*
* @param {string} rel_path - The relative path to list
* @returns {Promise<string[]>} Array of file paths
*/
async list(rel_path, opts = {}) {
if (!rel_path.startsWith(this.fs_path))
rel_path = this.fs_path + "/" + rel_path;
if (rel_path.startsWith("/"))
rel_path = rel_path.slice(1);
if (rel_path.endsWith("/"))
rel_path = rel_path.slice(0, -1);
if (rel_path.includes(".")) {
const { files: file_paths } = await this.obsidian_adapter.list(rel_path);
const files2 = file_paths.map((file_path) => {
if (this.smart_fs.fs_path)
file_path = file_path.replace(this.smart_fs.fs_path, "").slice(1);
const file_name = file_path.split("/").pop();
const file = {
basename: file_name.split(".")[0],
extension: file_name.split(".").pop().toLowerCase(),
name: file_name,
path: file_path
};
return file;
});
return files2;
}
const files = this.obsidian_app.vault.getAllLoadedFiles().filter((file) => {
const last_slash = file.path.lastIndexOf("/");
if (last_slash === -1 && rel_path !== "")
return false;
const folder_path = file.path.slice(0, last_slash);
if (folder_path !== rel_path)
return false;
return true;
});
return files;
}
async list_recursive(rel_path, opts = {}) {
if (!rel_path.startsWith(this.fs_path))
rel_path = this.fs_path + "/" + rel_path;
if (rel_path.startsWith("/"))
rel_path = rel_path.slice(1);
if (rel_path.endsWith("/"))
rel_path = rel_path.slice(0, -1);
const files = this.obsidian_app.vault.getAllLoadedFiles().filter((file) => {
if (file.path.length > 200) {
this.smart_fs.auto_excluded_files.push(file.path);
return false;
}
if (rel_path !== "" && !file.path.startsWith(rel_path))
return false;
if (file instanceof this.obsidian.TFile) {
if (opts.type === "folder")
return false;
file.type = "file";
} else if (file instanceof this.obsidian.TFolder) {
if (opts.type === "file")
return false;
delete file.basename;
delete file.extension;
file.type = "folder";
}
if (this.smart_fs.fs_path)
file.path = file.path.replace(this.smart_fs.fs_path, "").slice(1);
return true;
});
return files;
}
async list_files(rel_path) {
return await this.list(rel_path, { type: "file" });
}
async list_files_recursive(rel_path) {
return await this.list_recursive(rel_path, { type: "file" });
}
async list_folders(rel_path) {
return await this.list(rel_path, { type: "folder" });
}
async list_folders_recursive(rel_path) {
return await this.list_recursive(rel_path, { type: "folder" });
}
/**
* Read the contents of a file
*
* @param {string} rel_path - The relative path of the file to read
* @returns {Promise<string>} The contents of the file
*/
async read(rel_path, encoding, opts = {}) {
if (!rel_path.startsWith(this.fs_path))
rel_path = this.fs_path + "/" + rel_path;
if (encoding === "utf-8") {
if (!opts.no_cache) {
const tfile = this.obsidian_app.vault.getFileByPath(rel_path);
if (tfile)
return await this.obsidian_app.vault.cachedRead(tfile);
}
return await this.obsidian_adapter.read(rel_path);
}
if (encoding === "base64") {
const array_buffer2 = await this.obsidian_adapter.readBinary(rel_path, "base64");
const base64 = this.obsidian.arrayBufferToBase64(array_buffer2);
return base64;
}
const array_buffer = await this.obsidian_adapter.readBinary(rel_path);
return array_buffer;
}
/**
* Rename a file or directory
*
* @param {string} old_path - The current path of the file or directory
* @param {string} new_path - The new path for the file or directory
* @returns {Promise<void>} A promise that resolves when the operation is complete
*/
async rename(old_path, new_path) {
if (!old_path.startsWith(this.fs_path))
old_path = this.fs_path + "/" + old_path;
if (!new_path.startsWith(this.fs_path))
new_path = this.fs_path + "/" + new_path;
return await this.obsidian_adapter.rename(old_path, new_path);
}
/**
* Remove a file
*
* @param {string} rel_path - The relative path of the file to remove
* @returns {Promise<void>} A promise that resolves when the operation is complete
*/
async remove(rel_path) {
if (!rel_path.startsWith(this.fs_path))
rel_path = this.fs_path + "/" + rel_path;
try {
return await this.obsidian_adapter.remove(rel_path);
} catch (error) {
console.warn(`Error removing file: ${rel_path}`, error);
}
}
/**
* Remove a directory
*
* @param {string} rel_path - The relative path of the directory to remove
* @returns {Promise<void>} A promise that resolves when the operation is complete
*/
async remove_dir(rel_path, recursive = false) {
if (!rel_path.startsWith(this.fs_path))
rel_path = this.fs_path + "/" + rel_path;
return await this.obsidian_adapter.rmdir(rel_path, recursive);
}
/**
* Get file or directory information
*
* @param {string} rel_path - The relative path of the file or directory
* @returns {Promise<Object>} An object containing file or directory information
*/
async stat(rel_path) {
if (!rel_path.startsWith(this.fs_path))
rel_path = this.fs_path + "/" + rel_path;
return await this.obsidian_adapter.stat(rel_path);
}
/**
* Write content to a file
*
* @param {string} rel_path - The relative path of the file to write to
* @param {string} data - The content to write
* @returns {Promise<void>} A promise that resolves when the operation is complete
*/
async write(rel_path, data) {
if (!rel_path.startsWith(this.fs_path))
rel_path = this.fs_path + "/" + rel_path;
const folder_path = rel_path.split("/").slice(0, -1).join("/");
if (!await this.exists(folder_path)) {
await this.mkdir(folder_path);
console.log(`Created folder: ${folder_path}`);
}
return await this.obsidian_adapter.write(rel_path, data);
}
get_link_target_path(link_path, file_path) {
return this.obsidian_app.metadataCache.getFirstLinkpathDest(link_path, file_path)?.path;
}
get_base_path() {
return this.obsidian_adapter.basePath;
}
get_full_path(rel_path = "") {
const sep = rel_path.includes("/") ? "/" : "\\";
return this.get_base_path() + sep + rel_path;
}
};

var SmartView = class {
/**
* @constructor
* @param {object} opts - Additional options or overrides for rendering.
*/
constructor(opts = {}) {
this.opts = opts;
this._adapter = null;
}
/**
* Renders all setting components within a container.
* @async
* @param {HTMLElement} container - The container element.
* @param {Object} opts - Additional options for rendering.
* @returns {Promise<void>}
*/
async render_setting_components(container, opts = {}) {
const components = container.querySelectorAll(".setting-component");
for (const component of components) {
await this.render_setting_component(component, opts);
}
return container;
}
/**
* Creates a document fragment from HTML string.
* @param {string} html - The HTML string.
* @returns {DocumentFragment}
*/
create_doc_fragment(html) {
return document.createRange().createContextualFragment(html);
}
/**
* Gets the adapter instance used for rendering (e.g., Obsidian or Node, etc.).
* @returns {Object} The adapter instance.
*/
get adapter() {
if (!this._adapter) {
if (!this.opts.adapter) {
throw new Error("No adapter provided to SmartView. Provide a 'smart_view.adapter' in env config.");
}
const AdapterClass = this.opts.adapter;
this._adapter = new AdapterClass(this);
}
return this._adapter;
}
/**
* Gets an icon (implemented in the adapter).
* @param {string} icon_name - Name of the icon to get.
* @returns {string} The icon HTML string.
*/
get_icon_html(icon_name) {
return this.adapter.get_icon_html(icon_name);
}
/**
* Renders a single setting component (implemented in adapter).
* @async
* @param {HTMLElement} setting_elm - The DOM element for the setting.
* @param {Object} opts - Additional options for rendering.
* @returns {Promise<*>}
*/
async render_setting_component(setting_elm, opts = {}) {
return await this.adapter.render_setting_component(setting_elm, opts);
}
/**
* Renders markdown content (implemented in adapter).
* @param {string} markdown - The markdown content.
* @param {object|null} scope - The scope to pass for rendering.
* @returns {Promise<DocumentFragment>}
*/
async render_markdown(markdown, scope = null) {
return await this.adapter.render_markdown(markdown, scope);
}
/**
* Gets a value from an object by path.
* @param {Object} obj - The object to search in.
* @param {string} path - The path to the value.
* @returns {*}
*/
get_by_path(obj, path, settings_scope = null) {
return get_by_path(obj, path, settings_scope);
}
/**
* Sets a value in an object by path.
* @param {Object} obj - The object to modify.
* @param {string} path - The path to set the value.
* @param {*} value - The value to set.
*/
set_by_path(obj, path, value, settings_scope = null) {
set_by_path(obj, path, value, settings_scope);
}
/**
* Deletes a value from an object by path.
* @param {Object} obj - The object to modify.
* @param {string} path - The path to delete.
*/
delete_by_path(obj, path, settings_scope = null) {
delete_by_path(obj, path, settings_scope);
}
/**
* Escapes HTML special characters in a string.
* @param {string} str - The string to escape.
* @returns {string} The escaped string.
*/
escape_html(str) {
if (typeof str !== "string")
return str;
return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
/**
* A convenience method to build a setting HTML snippet from a config object.
* @param {Object} setting_config
* @returns {string}
*/
render_setting_html(setting_config) {
if (setting_config.type === "html") {
return setting_config.value;
}
const attributes = Object.entries(setting_config).map(([attr, value]) => {
if (attr.includes("class"))
return "";
if (typeof value === "number")
return `data-${attr.replace(/_/g, "-")}=${value}`;
return `data-${attr.replace(/_/g, "-")}="${value}"`;
}).join("\n");
return `<div class="setting-component${setting_config.scope_class ? " " + setting_config.scope_class : ""}"
data-setting="${setting_config.setting}"
${attributes}
></div>`;
}
/**
* Handles the smooth transition effect when opening overlays.
* @param {HTMLElement} overlay_container - The overlay container element.
*/
on_open_overlay(overlay_container) {
overlay_container.style.transition = "background-color 0.5s ease-in-out";
overlay_container.style.backgroundColor = "var(--bold-color)";
setTimeout(() => {
overlay_container.style.backgroundColor = "";
}, 500);
}
/**
* Renders settings from a config, returning a fragment.
* @async
* @param {Object} settings_config
* @param {Object} opts
* @returns {Promise<DocumentFragment>}
*/
async render_settings(settings_config4, opts = {}) {
const html = Object.entries(settings_config4).map(([setting_key, setting_config]) => {
if (!setting_config.setting) {
setting_config.setting = setting_key;
}
return this.render_setting_html(setting_config);
}).join("\n");
const frag = this.create_doc_fragment(`<div>${html}</div>`);
return await this.render_setting_components(frag, opts);
}
/**
* @function add_settings_listeners
* @description
* Scans the given container for elements that have `data-smart-setting` and attaches
* a 'change' event listener. On change, it updates the corresponding path in `scope.settings`.
*
* @param {Object} scope - An object containing a `settings` property, where new values will be stored.
* @param {HTMLElement} [container=document] - The DOM element to scan. Defaults to the entire document.
*/
add_settings_listeners(scope, container = document) {
const elements = container.querySelectorAll("[data-smart-setting]");
elements.forEach((elm) => {
const path = elm.dataset.smartSetting;
if (!path)
return;
if (!elm.dataset.listenerAttached) {
elm.dataset.listenerAttached = "true";
elm.addEventListener("change", () => {
let newValue;
if (elm instanceof HTMLInputElement) {
if (elm.type === "checkbox") {
newValue = elm.checked;
} else if (elm.type === "radio") {
if (elm.checked) {
newValue = elm.value;
} else {
return;
}
} else {
newValue = elm.value;
}
} else if (elm instanceof HTMLSelectElement || elm instanceof HTMLTextAreaElement) {
newValue = elm.value;
} else {
newValue = elm.value ?? elm.textContent;
}
this.set_by_path(scope.settings, path, newValue);
});
}
});
}
apply_style_sheet(sheet) {
if ("adoptedStyleSheets" in Document.prototype) {
document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
} else {
const styleEl = document.createElement("style");
if (sheet.cssRules) {
styleEl.textContent = Array.from(sheet.cssRules).map((rule) => rule.cssText).join("\n");
}
document.head.appendChild(styleEl);
}
}
};
function get_by_path(obj, path, settings_scope = null) {
if (!path)
return "";
const keys = path.split(".");
if (settings_scope) {
keys.unshift(settings_scope);
}
const finalKey = keys.pop();
const instance = keys.reduce((acc, key) => acc && acc[key], obj);
if (instance && typeof instance[finalKey] === "function") {
return instance[finalKey].bind(instance);
}
return instance ? instance[finalKey] : void 0;
}
function set_by_path(obj, path, value, settings_scope = null) {
const keys = path.split(".");
if (settings_scope) {
keys.unshift(settings_scope);
}
console.log("keys", keys);
const final_key = keys.pop();
const target = keys.reduce((acc, key) => {
if (!acc[key] || typeof acc[key] !== "object") {
acc[key] = {};
}
return acc[key];
}, obj);
target[final_key] = value;
}
function delete_by_path(obj, path, settings_scope = null) {
const keys = path.split(".");
if (settings_scope) {
keys.unshift(settings_scope);
}
const finalKey = keys.pop();
const instance = keys.reduce((acc, key) => acc && acc[key], obj);
if (instance) {
delete instance[finalKey];
}
}

var SmartViewAdapter = class {
constructor(main) {
this.main = main;
}
/**
* Retrieves the class used for settings.
* Must be overridden by subclasses to return the appropriate setting class.
* @abstract
* @returns {Function} The setting class constructor.
* @throws Will throw an error if not implemented in the subclass.
*/
get setting_class() {
throw new Error("setting_class() not implemented");
}
/**
* Generates the HTML for a specified icon.
* Must be overridden by subclasses to provide the correct icon HTML.
* @abstract
* @param {string} icon_name - The name of the icon to generate HTML for.
* @returns {string} The HTML string representing the icon.
* @throws Will throw an error if not implemented in the subclass.
*/
get_icon_html(icon_name) {
throw new Error("get_icon_html() not implemented");
}
/**
* Renders Markdown content within a specific scope.
* Must be overridden by subclasses to handle Markdown rendering appropriately.
* @abstract
* @param {string} markdown - The Markdown content to render.
* @param {object|null} [scope=null] - The scope within which to render the Markdown.
* @returns {Promise<void>} A promise that resolves when rendering is complete.
* @throws Will throw an error if not implemented in the subclass.
*/
async render_markdown(markdown, scope = null) {
throw new Error("render_markdown() not implemented");
}
/**
* Opens a specified URL.
* Should be overridden by subclasses to define how URLs are opened.
* @abstract
* @param {string} url - The URL to open.
*/
open_url(url) {
throw new Error("open_url() not implemented");
}
/**
* Handles the selection of a folder by invoking the folder selection dialog and updating the setting.
* @abstract
* @param {string} setting - The path of the setting being modified.
* @param {string} value - The current value of the setting.
* @param {HTMLElement} elm - The HTML element associated with the setting.
* @param {object} scope - The current scope containing settings and actions.
*/
handle_folder_select(path, value, elm, scope) {
throw new Error("handle_folder_select not implemented");
}
/**
* Handles the selection of a file by invoking the file selection dialog and updating the setting.
* @abstract
* @param {string} setting - The path of the setting being modified.
* @param {string} value - The current value of the setting.
* @param {HTMLElement} elm - The HTML element associated with the setting.
* @param {object} scope - The current scope containing settings and actions.
*/
handle_file_select(path, value, elm, scope) {
throw new Error("handle_file_select not implemented");
}
/**
* Performs actions before a setting is changed, such as clearing notices and updating the UI.
* @abstract
* @param {string} setting - The path of the setting being changed.
* @param {*} value - The new value for the setting.
* @param {HTMLElement} elm - The HTML element associated with the setting.
* @param {object} scope - The current scope containing settings and actions.
*/
pre_change(path, value, elm) {
}
/**
* Performs actions after a setting is changed, such as updating UI elements.
* @abstract
* @param {string} setting - The path of the setting that was changed.
* @param {*} value - The new value for the setting.
* @param {HTMLElement} elm - The HTML element associated with the setting.
* @param {object} changed - Additional information about the change.
*/
post_change(path, value, elm) {
}
/**
* Reverts a setting to its previous value in case of validation failure or error.
* @abstract
* @param {string} setting - The path of the setting to revert.
* @param {HTMLElement} elm - The HTML element associated with the setting.
* @param {object} scope - The current scope containing settings.
*/
revert_setting(path, elm, scope) {
console.warn("revert_setting() not implemented");
}
get setting_renderers() {
return {
text: this.render_text_component,
string: this.render_text_component,
password: this.render_password_component,
number: this.render_number_component,
dropdown: this.render_dropdown_component,
toggle: this.render_toggle_component,
textarea: this.render_textarea_component,
textarea_array: this.render_textarea_array_component,
button: this.render_button_component,
remove: this.render_remove_component,
folder: this.render_folder_select_component,
"text-file": this.render_file_select_component,
file: this.render_file_select_component,
slider: this.render_slider_component,
html: this.render_html_component,
button_with_confirm: this.render_button_with_confirm_component
};
}
async render_setting_component(elm, opts = {}) {
elm.innerHTML = "";
const path = elm.dataset.setting;
const scope = opts.scope || this.main.main;
const settings_scope = opts.settings_scope || null;
try {
let value = elm.dataset.value ?? this.main.get_by_path(scope.settings, path, settings_scope);
if (typeof value === "undefined" && typeof elm.dataset.default !== "undefined") {
value = elm.dataset.default;
if (typeof value === "string")
value = value.toLowerCase() === "true" ? true : value === "false" ? false : value;
this.main.set_by_path(scope.settings, path, value, settings_scope);
}
const renderer = this.setting_renderers[elm.dataset.type];
if (!renderer) {
console.warn(`Unsupported setting type: ${elm.dataset.type}`);
return elm;
}
const setting = renderer.call(this, elm, path, value, scope, settings_scope);
if (elm.dataset.name)
setting.setName(elm.dataset.name);
if (elm.dataset.description) {
const frag = this.main.create_doc_fragment(`<span>${elm.dataset.description}</span>`);
setting.setDesc(frag);
}
if (elm.dataset.tooltip)
setting.setTooltip(elm.dataset.tooltip);
this.add_button_if_needed(setting, elm, path, scope);
this.handle_disabled_and_hidden(elm);
return elm;
} catch (e) {
console.error(JSON.stringify({ path, elm }, null, 2));
console.error(JSON.stringify(e, null, 2));
}
}
render_dropdown_component(elm, path, value, scope, settings_scope) {
const smart_setting = new this.setting_class(elm);
let options;
if (elm.dataset.optionsCallback) {
console.log(`getting options callback: ${elm.dataset.optionsCallback}`);
const opts_callback = this.main.get_by_path(scope, elm.dataset.optionsCallback);
if (typeof opts_callback === "function")
options = opts_callback();
else
console.warn(`optionsCallback is not a function: ${elm.dataset.optionsCallback}`, scope);
}
if (!options || !options.length) {
options = this.get_dropdown_options(elm);
}
smart_setting.addDropdown((dropdown) => {
if (elm.dataset.required)
dropdown.inputEl.setAttribute("required", true);
options.forEach((option) => {
const opt = dropdown.addOption(option.value, option.name ?? option.value);
opt.selected = option.value === value;
});
dropdown.onChange((value2) => {
this.handle_on_change(path, value2, elm, scope, settings_scope);
});
dropdown.setValue(value);
});
return smart_setting;
}
render_text_component(elm, path, value, scope, settings_scope) {
const smart_setting = new this.setting_class(elm);
smart_setting.addText((text) => {
text.setPlaceholder(elm.dataset.placeholder || "");
if (value)
text.setValue(value);
let debounceTimer;
if (elm.dataset.button) {
smart_setting.addButton((button) => {
button.setButtonText(elm.dataset.button);
button.onClick(async () => this.handle_on_change(path, text.getValue(), elm, scope));
});
} else {
text.onChange(async (value2) => {
clearTimeout(debounceTimer);
debounceTimer = setTimeout(() => this.handle_on_change(path, value2.trim(), elm, scope, settings_scope), 2e3);
});
}
});
return smart_setting;
}
render_password_component(elm, path, value, scope, settings_scope) {
const smart_setting = new this.setting_class(elm);
smart_setting.addText((text) => {
text.inputEl.type = "password";
text.setPlaceholder(elm.dataset.placeholder || "");
if (value)
text.setValue(value);
let debounceTimer;
text.onChange(async (value2) => {
clearTimeout(debounceTimer);
debounceTimer = setTimeout(() => this.handle_on_change(path, value2, elm, scope, settings_scope), 2e3);
});
});
return smart_setting;
}
render_number_component(elm, path, value, scope, settings_scope) {
const smart_setting = new this.setting_class(elm);
smart_setting.addText((number) => {
number.inputEl.type = "number";
number.setPlaceholder(elm.dataset.placeholder || "");
if (typeof value !== "undefined")
number.inputEl.value = parseInt(value);
number.inputEl.min = elm.dataset.min || 0;
if (elm.dataset.max)
number.inputEl.max = elm.dataset.max;
let debounceTimer;
number.onChange(async (value2) => {
clearTimeout(debounceTimer);
debounceTimer = setTimeout(() => this.handle_on_change(path, parseInt(value2), elm, scope, settings_scope), 2e3);
});
});
return smart_setting;
}
render_toggle_component(elm, path, value, scope, settings_scope) {
const smart_setting = new this.setting_class(elm);
smart_setting.addToggle((toggle) => {
let checkbox_val = value ?? false;
if (typeof checkbox_val === "string") {
checkbox_val = checkbox_val.toLowerCase() === "true";
}
toggle.setValue(checkbox_val);
toggle.onChange(async (value2) => this.handle_on_change(path, value2, elm, scope, settings_scope));
});
return smart_setting;
}
render_textarea_component(elm, path, value, scope, settings_scope) {
const smart_setting = new this.setting_class(elm);
smart_setting.addTextArea((textarea) => {
textarea.setPlaceholder(elm.dataset.placeholder || "");
textarea.setValue(value || "");
let debounceTimer;
textarea.onChange(async (value2) => {
clearTimeout(debounceTimer);
debounceTimer = setTimeout(() => this.handle_on_change(path, value2, elm, scope, settings_scope), 2e3);
});
});
return smart_setting;
}
render_textarea_array_component(elm, path, value, scope, settings_scope) {
const smart_setting = new this.setting_class(elm);
smart_setting.addTextArea((textarea) => {
textarea.setPlaceholder(elm.dataset.placeholder || "");
textarea.setValue(Array.isArray(value) ? value.join("\n") : value || "");
let debounceTimer;
textarea.onChange(async (value2) => {
value2 = value2.split("\n").map((v) => v.trim()).filter((v) => v);
clearTimeout(debounceTimer);
debounceTimer = setTimeout(() => this.handle_on_change(path, value2, elm, scope, settings_scope), 2e3);
});
});
return smart_setting;
}
render_button_component(elm, path, value, scope, settings_scope) {
const smart_setting = new this.setting_class(elm);
smart_setting.addButton((button) => {
button.setButtonText(elm.dataset.btnText || elm.dataset.name);
button.onClick(async () => {
if (elm.dataset.confirm && !confirm(elm.dataset.confirm))
return;
if (elm.dataset.href)
this.open_url(elm.dataset.href);
if (elm.dataset.callback) {
const callback = this.main.get_by_path(scope, elm.dataset.callback);
if (callback)
callback(path, value, elm, scope, settings_scope);
}
});
});
return smart_setting;
}
render_remove_component(elm, path, value, scope, settings_scope) {
const smart_setting = new this.setting_class(elm);
smart_setting.addButton((button) => {
button.setButtonText(elm.dataset.btnText || elm.dataset.name || "Remove");
button.onClick(async () => {
this.main.delete_by_path(scope.settings, path, settings_scope);
if (elm.dataset.callback) {
const callback = this.main.get_by_path(scope, elm.dataset.callback);
if (callback)
callback(path, value, elm, scope, settings_scope);
}
});
});
return smart_setting;
}
render_folder_select_component(elm, path, value, scope, settings_scope) {
const smart_setting = new this.setting_class(elm);
smart_setting.addFolderSelect((folder_select) => {
folder_select.setPlaceholder(elm.dataset.placeholder || "");
if (value)
folder_select.setValue(value);
folder_select.inputEl.closest("div").addEventListener("click", () => {
this.handle_folder_select(path, value, elm, scope);
});
folder_select.inputEl.querySelector("input").addEventListener("change", (e) => {
const folder = e.target.value;
this.handle_on_change(path, folder, elm, scope, settings_scope);
console.log("folder changed", folder);
});
});
return smart_setting;
}
render_file_select_component(elm, path, value, scope, settings_scope) {
const smart_setting = new this.setting_class(elm);
smart_setting.addFileSelect((file_select) => {
file_select.setPlaceholder(elm.dataset.placeholder || "");
if (value)
file_select.setValue(value);
file_select.inputEl.closest("div").addEventListener("click", () => {
this.handle_file_select(path, value, elm, scope, settings_scope);
});
});
return smart_setting;
}
render_slider_component(elm, path, value, scope, settings_scope) {
const smart_setting = new this.setting_class(elm);
smart_setting.addSlider((slider) => {
const min = parseFloat(elm.dataset.min) || 0;
const max = parseFloat(elm.dataset.max) || 100;
const step = parseFloat(elm.dataset.step) || 1;
const currentValue = typeof value !== "undefined" ? parseFloat(value) : min;
slider.setLimits(min, max, step);
slider.setValue(currentValue);
slider.onChange((newVal) => {
const numericVal = parseFloat(newVal);
this.handle_on_change(path, numericVal, elm, scope, settings_scope);
});
});
return smart_setting;
}
render_html_component(elm, path, value, scope) {
elm.innerHTML = value;
return elm;
}
add_button_if_needed(smart_setting, elm, path, scope) {
if (elm.dataset.btn) {
smart_setting.addButton((button) => {
button.setButtonText(elm.dataset.btn);
button.inputEl.addEventListener("click", (e) => {
if (elm.dataset.btnCallback && typeof scope[elm.dataset.btnCallback] === "function") {
if (elm.dataset.btnCallbackArg)
scope[elm.dataset.btnCallback](elm.dataset.btnCallbackArg);
else
scope[elm.dataset.btnCallback](path, null, smart_setting, scope);
} else if (elm.dataset.btnHref) {
this.open_url(elm.dataset.btnHref);
} else if (elm.dataset.callback && typeof this.main.get_by_path(scope, elm.dataset.callback) === "function") {
this.main.get_by_path(scope, elm.dataset.callback)(path, null, smart_setting, scope);
} else if (elm.dataset.href) {
this.open_url(elm.dataset.href);
} else {
console.error("No callback or href found for button.");
}
});
if (elm.dataset.btnDisabled || elm.dataset.disabled && elm.dataset.btnDisabled !== "false") {
button.inputEl.disabled = true;
}
});
}
}
handle_disabled_and_hidden(elm) {
if (elm.dataset.disabled && elm.dataset.disabled !== "false") {
elm.classList.add("disabled");
elm.querySelector("input, select, textarea, button").disabled = true;
}
if (elm.dataset.hidden && elm.dataset.hidden !== "false") {
elm.style.display = "none";
}
}
get_dropdown_options(elm) {
return Object.entries(elm.dataset).reduce((acc, [k, v]) => {
if (!k.startsWith("option"))
return acc;
const [value, name] = v.split("|");
acc.push({ value, name: name || value });
return acc;
}, []);
}
handle_on_change(path, value, elm, scope, settings_scope) {
this.pre_change(path, value, elm, scope);
if (elm.dataset.validate) {
const valid = this[elm.dataset.validate](path, value, elm, scope);
if (!valid) {
elm.querySelector(".setting-item").style.border = "2px solid red";
this.revert_setting(path, elm, scope);
return;
}
}
this.main.set_by_path(scope.settings, path, value, settings_scope);
if (elm.dataset.callback) {
const callback = this.main.get_by_path(scope, elm.dataset.callback);
if (callback)
callback(path, value, elm, scope);
}
this.post_change(path, value, elm, scope);
}
render_button_with_confirm_component(elm, path, value, scope) {
const smart_setting = new this.setting_class(elm);
smart_setting.addButton((button) => {
button.setButtonText(elm.dataset.btnText || elm.dataset.name);
elm.appendChild(this.main.create_doc_fragment(`
<div class="sc-inline-confirm-row" style="
display: none;
">
<span style="margin-right: 10px;">
${elm.dataset.confirm || "Are you sure?"}
</span>
<span class="sc-inline-confirm-row-buttons">
<button class="sc-inline-confirm-yes">Yes</button>
<button class="sc-inline-confirm-cancel">Cancel</button>
</span>
</div>
`));
const confirm_row = elm.querySelector(".sc-inline-confirm-row");
const confirm_yes = confirm_row.querySelector(".sc-inline-confirm-yes");
const confirm_cancel = confirm_row.querySelector(".sc-inline-confirm-cancel");
button.onClick(async () => {
confirm_row.style.display = "block";
elm.querySelector(".setting-item").style.display = "none";
});
confirm_yes.addEventListener("click", async () => {
if (elm.dataset.href)
this.open_url(elm.dataset.href);
if (elm.dataset.callback) {
const callback = this.main.get_by_path(scope, elm.dataset.callback);
if (callback)
callback(path, value, elm, scope);
}
elm.querySelector(".setting-item").style.display = "block";
confirm_row.style.display = "none";
});
confirm_cancel.addEventListener("click", () => {
confirm_row.style.display = "none";
elm.querySelector(".setting-item").style.display = "block";
});
});
return smart_setting;
}
};

var import_obsidian = require("obsidian");
var SmartViewObsidianAdapter = class extends SmartViewAdapter {
get setting_class() {
return import_obsidian.Setting;
}
open_url(url) {
window.open(url);
}
async render_file_select_component(elm, path, value) {
return super.render_text_component(elm, path, value);
}
async render_folder_select_component(elm, path, value) {
return super.render_text_component(elm, path, value);
}
async render_markdown(markdown, scope) {
const component = scope.env.smart_connections_plugin?.connections_view || new import_obsidian.Component();
if (!scope)
return console.warn("Scope required for rendering markdown in Obsidian adapter");
const frag = this.main.create_doc_fragment("<div><div class='inner'></div></div>");
const container = frag.querySelector(".inner");
try {
await import_obsidian.MarkdownRenderer.render(
scope.env.plugin.app,
markdown,
container,
scope?.file_path || "",
component
);
} catch (e) {
console.warn("Error rendering markdown in Obsidian adapter", e);
}
return frag;
}
get_icon_html(name) {
return (0, import_obsidian.getIcon)(name).outerHTML;
}
is_mod_event(event) {
return import_obsidian.Keymap.isModEvent(event);
}
};

function collection_instance_name_from(class_name) {
if (class_name.endsWith("Item")) {
return class_name.replace(/Item$/, "").toLowerCase();
}
return class_name.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase().replace(/y$/, "ie") + "s";
}

function create_uid(data) {
const str = JSON.stringify(data);
let hash = 0;
if (str.length === 0)
return hash;
for (let i = 0; i < str.length; i++) {
const char = str.charCodeAt(i);
hash = (hash << 5) - hash + char;
hash = hash & hash;
if (hash < 0)
hash = hash * -1;
}
return hash.toString() + str.length;
}
function deep_merge2(target, source) {
for (const key in source) {
if (source.hasOwnProperty(key)) {
if (is_obj(source[key]) && is_obj(target[key]))
deep_merge2(target[key], source[key]);
else
target[key] = source[key];
}
}
return target;
function is_obj(item) {
return item && typeof item === "object" && !Array.isArray(item);
}
}

function deep_equal(obj1, obj2, visited = /* @__PURE__ */ new WeakMap()) {
if (obj1 === obj2)
return true;
if (obj1 === null || obj2 === null || obj1 === void 0 || obj2 === void 0)
return false;
if (typeof obj1 !== typeof obj2 || Array.isArray(obj1) !== Array.isArray(obj2))
return false;
if (Array.isArray(obj1)) {
if (obj1.length !== obj2.length)
return false;
return obj1.every((item, index) => deep_equal(item, obj2[index], visited));
}
if (typeof obj1 === "object") {
if (visited.has(obj1))
return visited.get(obj1) === obj2;
visited.set(obj1, obj2);
const keys1 = Object.keys(obj1);
const keys2 = Object.keys(obj2);
if (keys1.length !== keys2.length)
return false;
return keys1.every((key) => deep_equal(obj1[key], obj2[key], visited));
}
return obj1 === obj2;
}

var CollectionItem = class _CollectionItem {
/**
* Default properties for an instance of CollectionItem.
* Override in subclasses to define different defaults.
* @returns {Object}
*/
static get defaults() {
return {
data: {}
};
}
/**
* @param {Object} env - The environment/context.
* @param {Object|null} [data=null] - Initial data for the item.
*/
constructor(env, data = null) {
env.create_env_getter(this);
this.config = this.env?.config;
this.merge_defaults();
if (data)
deep_merge2(this.data, data);
if (!this.data.class_name)
this.data.class_name = this.constructor.name;
}
/**
* Loads an item from data and initializes it.
* @param {Object} env
* @param {Object} data
* @returns {CollectionItem}
*/
static load(env, data) {
const item = new this(env, data);
item.init();
return item;
}
/**
* Merge default properties from the entire inheritance chain.
* @private
*/
merge_defaults() {
let current_class = this.constructor;
while (current_class) {
for (let key in current_class.defaults) {
const default_val = current_class.defaults[key];
if (typeof default_val === "object") {
this[key] = { ...default_val, ...this[key] };
} else {
this[key] = this[key] === void 0 ? default_val : this[key];
}
}
current_class = Object.getPrototypeOf(current_class);
}
}
/**
* Generates or retrieves a unique key for the item.
* Key syntax supports:
* - `[i]` for sequences
* - `/` for super-sources (groups, directories, clusters)
* - `#` for sub-sources (blocks)
* @returns {string} The unique key
*/
get_key() {
return create_uid(this.data);
}
/**
* Updates the item data and returns true if changed.
* @param {Object} data
* @returns {boolean} True if data changed.
*/
update_data(data) {
const sanitized_data = this.sanitize_data(data);
const current_data = { ...this.data };
deep_merge2(current_data, sanitized_data);
const changed = !deep_equal(this.data, current_data);
if (!changed)
return false;
this.data = current_data;
return true;
}
/**
* Sanitizes data for saving. Ensures no circular references.
* @param {*} data
* @returns {*} Sanitized data.
*/
sanitize_data(data) {
if (data instanceof _CollectionItem)
return data.ref;
if (Array.isArray(data))
return data.map((val) => this.sanitize_data(val));
if (typeof data === "object" && data !== null) {
return Object.keys(data).reduce((acc, key) => {
acc[key] = this.sanitize_data(data[key]);
return acc;
}, {});
}
return data;
}
/**
* Initializes the item. Override as needed.
* @param {Object} [input_data] - Additional data that might be provided on creation.
*/
init(input_data) {
}
/**
* Queues this item for saving.
*/
queue_save() {
this._queue_save = true;
}
/**
* Saves this item using its data adapter.
* @returns {Promise<void>}
*/
async save() {
try {
await this.data_adapter.save_item(this);
this.init();
} catch (err) {
this._queue_save = true;
console.error(err, err.stack);
}
}
/**
* Queues this item for loading.
*/
queue_load() {
this._queue_load = true;
}
/**
* Loads this item using its data adapter.
* @returns {Promise<void>}
*/
async load() {
try {
await this.data_adapter.load_item(this);
this.init();
} catch (err) {
this._load_error = err;
this.on_load_error(err);
}
}
/**
* Handles load errors by re-queuing for load.
* Override if needed.
* @param {Error} err
*/
on_load_error(err) {
this.queue_load();
}
/**
* Validates the item before saving. Checks for presence and validity of key.
* @returns {boolean}
*/
validate_save() {
if (!this.key)
return false;
if (this.key.trim() === "")
return false;
if (this.key === "undefined")
return false;
return true;
}
/**
* Marks this item as deleted. This does not immediately remove it from memory,
* but queues a save that will result in the item being removed from persistent storage.
*/
delete() {
this.deleted = true;
this.queue_save();
}
/**
* Filters items in the collection based on provided options.
* functional filter (returns true or false) for filtering items in collection; called by collection class
* @param {Object} filter_opts - Filtering options.
* @param {string} [filter_opts.exclude_key] - A single key to exclude.
* @param {string[]} [filter_opts.exclude_keys] - An array of keys to exclude. If exclude_key is provided, it's added to this array.
* @param {string} [filter_opts.exclude_key_starts_with] - Exclude keys starting with this string.
* @param {string[]} [filter_opts.exclude_key_starts_with_any] - Exclude keys starting with any of these strings.
* @param {string} [filter_opts.exclude_key_includes] - Exclude keys that include this string.
* @param {string} [filter_opts.key_ends_with] - Include only keys ending with this string.
* @param {string} [filter_opts.key_starts_with] - Include only keys starting with this string.
* @param {string[]} [filter_opts.key_starts_with_any] - Include only keys starting with any of these strings.
* @param {string} [filter_opts.key_includes] - Include only keys that include this string.
* @returns {boolean} True if the item passes the filter, false otherwise.
*/
filter(filter_opts = {}) {
const {
exclude_key,
exclude_keys = exclude_key ? [exclude_key] : [],
exclude_key_starts_with,
exclude_key_starts_with_any,
exclude_key_includes,
exclude_key_includes_any,
key_ends_with,
key_starts_with,
key_starts_with_any,
key_includes,
key_includes_any
} = filter_opts;
if (exclude_keys?.includes(this.key))
return false;
if (exclude_key_starts_with && this.key.startsWith(exclude_key_starts_with))
return false;
if (exclude_key_starts_with_any && exclude_key_starts_with_any.some((prefix) => this.key.startsWith(prefix)))
return false;
if (exclude_key_includes && this.key.includes(exclude_key_includes))
return false;
if (exclude_key_includes_any && exclude_key_includes_any.some((include) => this.key.includes(include)))
return false;
if (key_ends_with && !this.key.endsWith(key_ends_with))
return false;
if (key_starts_with && !this.key.startsWith(key_starts_with))
return false;
if (key_starts_with_any && !key_starts_with_any.some((prefix) => this.key.startsWith(prefix)))
return false;
if (key_includes && !this.key.includes(key_includes))
return false;
if (key_includes_any && !key_includes_any.some((include) => this.key.includes(include)))
return false;
return true;
}
/**
* Parses item data for additional processing. Override as needed.
*/
parse() {
}
/**
* Helper function to render a component in the item scope
* @param {*} component_key
* @param {*} opts
* @returns
*/
async render_component(component_key, opts = {}) {
return await this.env.render_component(component_key, this, opts);
}
get actions() {
if (!this._actions) {
this._actions = Object.entries(this.env.opts.items[this.item_type_key].actions || {}).reduce((acc, [k, v]) => {
acc[k] = v.bind(this);
return acc;
}, {});
}
return this._actions;
}
/**
* Derives the collection key from the class name.
* @returns {string}
*/
static get collection_key() {
let name = this.name;
if (name.match(/\d$/))
name = name.slice(0, -1);
return collection_instance_name_from(name);
}
/**
* @returns {string} The collection key for this item.
*/
get collection_key() {
let name = this.constructor.name;
if (name.match(/\d$/))
name = name.slice(0, -1);
return collection_instance_name_from(name);
}
/**
* Retrieves the parent collection from the environment.
* @returns {Collection}
*/
get collection() {
return this.env[this.collection_key];
}
/**
* @returns {string} The item's key.
*/
get key() {
return this.data?.key || this.get_key();
}
get item_type_key() {
let name = this.constructor.name;
if (name.match(/\d$/))
name = name.slice(0, -1);
return camel_case_to_snake_case2(name);
}
/**
* A simple reference object for this item.
* @returns {{collection_key: string, key: string}}
*/
get ref() {
return { collection_key: this.collection_key, key: this.key };
}
/**
* @returns {Object} The data adapter for this item's collection.
*/
get data_adapter() {
return this.collection.data_adapter;
}
/**
* @returns {Object} The filesystem adapter.
*/
get data_fs() {
return this.collection.data_fs;
}
/**
* Access to collection-level settings.
* @returns {Object}
*/
get settings() {
if (!this.env.settings[this.collection_key])
this.env.settings[this.collection_key] = {};
return this.env.settings[this.collection_key];
}
set settings(settings) {
this.env.settings[this.collection_key] = settings;
this.env.smart_settings.save();
}
/**
* Render this item into a container using the item's component.
* @deprecated 2024-12-02 Use explicit component pattern from environment
* @param {HTMLElement} container
* @param {Object} opts
* @returns {Promise<HTMLElement>}
*/
async render_item(container, opts = {}) {
const frag = await this.component.call(this.smart_view, this, opts);
container.innerHTML = "";
container.appendChild(frag);
return container;
}
/**
* @deprecated use env.smart_view
* @returns {Object}
*/
get smart_view() {
if (!this._smart_view)
this._smart_view = this.env.init_module("smart_view");
return this._smart_view;
}
/**
* Override in child classes to set the component for this item
* @deprecated 2024-12-02
* @returns {Function} The render function for this component
*/
get component() {
return item_component;
}
};
function camel_case_to_snake_case2(str) {
const result = str.replace(/([A-Z])/g, (match) => `_${match.toLowerCase()}`).replace(/^_/, "").replace(/2$/, "");
return result;
}

var AsyncFunction = Object.getPrototypeOf(async function() {
}).constructor;
var Collection = class {
/**
* Constructs a new Collection instance.
*
* @param {Object} env - The environment context containing configurations and adapters.
* @param {Object} [opts={}] - Optional configuration.
* @param {string} [opts.collection_key] - Custom key to override default collection name.
* @param {string} [opts.data_dir] - Custom data directory path.
* @param {boolean} [opts.prevent_load_on_init] - Whether to prevent loading items on initialization.
*/
constructor(env, opts = {}) {
env.create_env_getter(this);
this.opts = opts;
if (opts.collection_key)
this.collection_key = opts.collection_key;
this.env[this.collection_key] = this;
this.config = this.env.config;
this.items = {};
this.loaded = null;
this._loading = false;
this.load_time_ms = null;
this.settings_container = null;
}
/**
* Initializes a new collection in the environment. Override in subclass if needed.
*
* @param {Object} env
* @param {Object} [opts={}]
* @returns {Promise<void>}
*/
static async init(env, opts = {}) {
env[this.collection_key] = new this(env, opts);
await env[this.collection_key].init();
env.collections[this.collection_key] = "init";
}
/**
* The unique collection key derived from the class name.
* @returns {string}
*/
static get collection_key() {
let name = this.name;
if (name.match(/\d$/))
name = name.slice(0, -1);
return name.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
}
/**
* Instance-level init. Override in subclasses if necessary.
* @returns {Promise<void>}
*/
async init() {
}
/**
* Creates or updates an item in the collection.
* - If `data` includes a key that matches an existing item, that item is updated.
* - Otherwise, a new item is created.
* After updating or creating, the item is validated. If validation fails, the item is logged and returned without being saved.
* If validation succeeds for a new item, it is added to the collection and marked for saving.
*
* If the item’s `init()` method is async, a promise is returned that resolves once init completes.
*
* @param {Object} [data={}] - Data for creating/updating an item.
* @returns {Promise<Item>|Item} The created or updated item. May return a promise if `init()` is async.
*/
create_or_update(data = {}) {
const existing_item = this.find_by(data);
const item = existing_item ? existing_item : new this.item_type(this.env);
item._queue_save = !existing_item;
const data_changed = item.update_data(data);
if (!existing_item && !item.validate_save()) {
return item;
}
if (!existing_item) {
this.set(item);
}
if (existing_item && !data_changed)
return existing_item;
if (item.init instanceof AsyncFunction) {
return new Promise((resolve) => {
item.init(data).then(() => resolve(item));
});
}
item.init(data);
return item;
}
/**
* Finds an item by partial data match (first checks key). If `data.key` provided,
* returns the item with that key; otherwise attempts a match by merging data.
*
* @param {Object} data - Data to match against.
* @returns {Item|null}
*/
find_by(data) {
if (data.key)
return this.get(data.key);
const temp = new this.item_type(this.env);
const temp_data = JSON.parse(JSON.stringify(data, temp.sanitize_data(data)));
deep_merge2(temp.data, temp_data);
return temp.key ? this.get(temp.key) : null;
}
/**
* Filters items based on provided filter options or a custom function.
*
* @param {Object|Function} [filter_opts={}] - Filter options or a predicate function.
* @returns {Item[]} Array of filtered items.
*/
filter(filter_opts = {}) {
if (typeof filter_opts === "function") {
return Object.values(this.items).filter(filter_opts);
}
filter_opts = this.prepare_filter(filter_opts);
const results = [];
const { first_n } = filter_opts;
for (const item of Object.values(this.items)) {
if (first_n && results.length >= first_n)
break;
if (item.filter(filter_opts))
results.push(item);
}
return results;
}
/**
* Alias for `filter()`
* @param {Object|Function} filter_opts
* @returns {Item[]}
*/
list(filter_opts) {
return this.filter(filter_opts);
}
/**
* Prepares filter options. Can be overridden by subclasses to normalize filter options.
*
* @param {Object} filter_opts
* @returns {Object} Prepared filter options.
*/
prepare_filter(filter_opts) {
return filter_opts;
}
/**
* Retrieves an item by key.
* @param {string} key
* @returns {Item|undefined}
*/
get(key) {
return this.items[key];
}
/**
* Retrieves multiple items by an array of keys.
* @param {string[]} keys
* @returns {Item[]}
*/
get_many(keys = []) {
if (!Array.isArray(keys)) {
console.error("get_many called with non-array keys:", keys);
return [];
}
return keys.map((key) => this.get(key)).filter(Boolean);
}
/**
* Retrieves a random item from the collection, optionally filtered by options.
* @param {Object} [opts]
* @returns {Item|undefined}
*/
get_rand(opts = null) {
if (opts) {
const filtered = this.filter(opts);
return filtered[Math.floor(Math.random() * filtered.length)];
}
const keys = this.keys;
return this.items[keys[Math.floor(Math.random() * keys.length)]];
}
/**
* Adds or updates an item in the collection.
* @param {Item} item
*/
set(item) {
if (!item.key)
throw new Error("Item must have a key property");
this.items[item.key] = item;
}
/**
* Updates multiple items by their keys.
* @param {string[]} keys
* @param {Object} data
*/
update_many(keys = [], data = {}) {
this.get_many(keys).forEach((item) => item.update_data(data));
}
/**
* Clears all items from the collection.
*/
clear() {
this.items = {};
}
/**
* @returns {string} The collection key, can be overridden by opts.collection_key
*/
get collection_key() {
return this._collection_key ? this._collection_key : this.constructor.collection_key;
}
set collection_key(key) {
this._collection_key = key;
}
/**
* Lazily initializes and returns the data adapter instance for this collection.
* @returns {Object} The data adapter instance.
*/
get data_adapter() {
if (!this._data_adapter) {
const AdapterClass = this.get_adapter_class("data");
this._data_adapter = new AdapterClass(this);
}
return this._data_adapter;
}
get_adapter_class(type) {
const config = this.env.opts.collections?.[this.collection_key];
const adapter_key = type + "_adapter";
const adapter_module = config?.[adapter_key] ?? this.env.opts.collections?.smart_collections?.[adapter_key];
if (typeof adapter_module === "function")
return adapter_module;
if (typeof adapter_module?.collection === "function")
return adapter_module.collection;
throw new Error(`No '${type}' adapter class found for ${this.collection_key} or smart_collections`);
}
/**
* Data directory strategy for this collection. Defaults to 'multi'.
* @returns {string}
*/
get data_dir() {
return this.collection_key;
}
/**
* File system adapter from the environment.
* @returns {Object}
*/
get data_fs() {
return this.env.data_fs;
}
/**
* Derives the corresponding item class name based on this collection's class name.
* @returns {string}
*/
get item_class_name() {
let name = this.constructor.name;
if (name.match(/\d$/))
name = name.slice(0, -1);
if (name.endsWith("ies"))
return name.slice(0, -3) + "y";
else if (name.endsWith("s"))
return name.slice(0, -1);
return name + "Item";
}
/**
* Derives a readable item name from the item class name.
* @returns {string}
*/
get item_name() {
return this.item_class_name.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
}
/**
* Retrieves the item type (constructor) from the environment.
* @returns {Function} Item constructor.
*/
get item_type() {
if (this.opts.item_type)
return this.opts.item_type;
return this.env.item_types[this.item_class_name];
}
/**
* Returns an array of all keys in the collection.
* @returns {string[]}
*/
get keys() {
return Object.keys(this.items);
}
/**
* @deprecated use data_adapter instead (2024-09-14)
*/
get adapter() {
return this.data_adapter;
}
/**
* @method process_save_queue
* @description
* Saves items flagged for saving (_queue_save) back to AJSON or SQLite. This ensures persistent storage
* of any updates made since last load/import. This method also writes changes to disk (AJSON files or DB).
*/
async process_save_queue(opts = {}) {
if (opts.force) {
Object.values(this.items).forEach((item) => item._queue_save = true);
}
await this.data_adapter.process_save_queue(opts);
}
/**
* @alias process_save_queue
* @returns {Promise<void>}
*/
async save(opts = {}) {
await this.process_save_queue(opts);
}
/**
* @method process_load_queue
* @description
* Loads items that have been flagged for loading (_queue_load). This may involve
* reading from AJSON/SQLite or re-importing from markdown if needed.
* Called once initial environment is ready and collections are known.
*/
async process_load_queue() {
await this.data_adapter.process_load_queue();
}
/**
* Retrieves processed settings configuration.
* @returns {Object}
*/
get settings_config() {
return this.process_settings_config({});
}
/**
* Processes given settings config, adding prefixes and handling conditionals.
*
* @private
* @param {Object} _settings_config
* @param {string} [prefix='']
* @returns {Object}
*/
process_settings_config(_settings_config, prefix = "") {
const add_prefix = (key) => prefix && !key.includes(`${prefix}.`) ? `${prefix}.${key}` : key;
return Object.entries(_settings_config).reduce((acc, [key, val]) => {
let new_val = { ...val };
if (new_val.conditional) {
if (!new_val.conditional(this))
return acc;
delete new_val.conditional;
}
if (new_val.callback)
new_val.callback = add_prefix(new_val.callback);
if (new_val.btn_callback)
new_val.btn_callback = add_prefix(new_val.btn_callback);
if (new_val.options_callback)
new_val.options_callback = add_prefix(new_val.options_callback);
const new_key = add_prefix(this.process_setting_key(key));
acc[new_key] = new_val;
return acc;
}, {});
}
/**
* Processes an individual setting key. Override if needed.
* @param {string} key
* @returns {string}
*/
process_setting_key(key) {
return key;
}
/**
* Default settings for this collection. Override in subclasses as needed.
* @returns {Object}
*/
get default_settings() {
return {};
}
/**
* Current settings for the collection.
* Initializes with default settings if none exist.
* @returns {Object}
*/
get settings() {
if (!this.env.settings[this.collection_key]) {
this.env.settings[this.collection_key] = this.default_settings;
}
return this.env.settings[this.collection_key];
}
/**
* @deprecated use env.smart_view instead
* @returns {Object} smart_view instance
*/
get smart_view() {
if (!this._smart_view)
this._smart_view = this.env.init_module("smart_view");
return this._smart_view;
}
/**
* Renders the settings for the collection into a given container.
* @param {HTMLElement} [container=this.settings_container]
* @param {Object} opts
* @returns {Promise<HTMLElement>}
*/
async render_settings(container = this.settings_container, opts = {}) {
return await this.render_collection_settings(container, opts);
}
/**
* Helper function to render collection settings.
* @param {HTMLElement} [container=this.settings_container]
* @param {Object} opts
* @returns {Promise<HTMLElement>}
*/
async render_collection_settings(container = this.settings_container, opts = {}) {
if (container && (!this.settings_container || this.settings_container !== container)) {
this.settings_container = container;
} else if (!container) {
container = this.env.smart_view.create_doc_fragment("<div></div>");
}
container.innerHTML = `<div class="sc-loading">Loading ${this.collection_key} settings...</div>`;
const frag = await this.env.render_component("settings", this, opts);
container.innerHTML = "";
container.appendChild(frag);
return container;
}
/**
* Unloads collection data from memory.
*/
unload() {
this.clear();
this.unloaded = true;
this.env.collections[this.collection_key] = null;
}
/**
* Helper function to render a component in the collection scope
* @param {*} component_key
* @param {*} opts
* @returns
*/
async render_component(component_key, opts = {}) {
return await this.env.render_component(component_key, this, opts);
}
show_process_notice(process2, opts = {}) {
if (!this.debounce_process_notice)
this.debounce_process_notice = {};
this.debounce_process_notice[process2] = setTimeout(() => {
this.debounce_process_notice[process2] = null;
this.env.notices?.show(process2, { collection_key: this.collection_key, ...opts });
}, 1e3);
}
clear_process_notice(process2) {
if (this.debounce_process_notice?.[process2]) {
clearTimeout(this.debounce_process_notice[process2]);
this.debounce_process_notice[process2] = null;
} else {
this.env.notices?.remove(process2);
}
}
};

var EntitiesVectorAdapter = class {
/**
* @constructor
* @param {Object} collection - The collection (SmartEntities or derived class) instance.
*/
constructor(collection) {
this.collection = collection;
}
/**
* Find the nearest entities to the given vector.
* @async
* @param {number[]} vec - The reference vector.
* @param {Object} [filter={}] - Optional filters (limit, exclude, etc.)
* @returns {Promise<Array<{item:Object, score:number}>>} Array of results sorted by score descending.
* @throws {Error} Not implemented by default.
*/
async nearest(vec, filter = {}) {
throw new Error("EntitiesVectorAdapter.nearest() not implemented");
}
/**
* Find the furthest entities from the given vector.
* @async
* @param {number[]} vec - The reference vector.
* @param {Object} [filter={}] - Optional filters (limit, exclude, etc.)
* @returns {Promise<Array<{item:Object, score:number}>>} Array of results sorted by score ascending (furthest).
* @throws {Error} Not implemented by default.
*/
async furthest(vec, filter = {}) {
throw new Error("EntitiesVectorAdapter.furthest() not implemented");
}
/**
* Embed a batch of entities.
* @async
* @param {Object[]} entities - Array of entity instances to embed.
* @returns {Promise<void>}
* @throws {Error} Not implemented by default.
*/
async embed_batch(entities) {
throw new Error("EntitiesVectorAdapter.embed_batch() not implemented");
}
/**
* Process a queue of entities waiting to be embedded.
* Typically, this will call embed_batch in batches and update entities.
* @async
* @param {Object[]} embed_queue - Array of entities to embed.
* @returns {Promise<void>}
* @throws {Error} Not implemented by default.
*/
async process_embed_queue(embed_queue) {
throw new Error("EntitiesVectorAdapter.process_embed_queue() not implemented");
}
};
var EntityVectorAdapter = class {
/**
* @constructor
* @param {Object} item - The SmartEntity instance that this adapter is associated with.
*/
constructor(item) {
this.item = item;
}
/**
* Retrieve the current vector embedding for this entity.
* @async
* @returns {Promise<number[]|undefined>} The entity's vector or undefined if not set.
* @throws {Error} Not implemented by default.
*/
async get_vec() {
throw new Error("EntityVectorAdapter.get_vec() not implemented");
}
/**
* Store/update the vector embedding for this entity.
* @async
* @param {number[]} vec - The vector to set.
* @returns {Promise<void>}
* @throws {Error} Not implemented by default.
*/
async set_vec(vec) {
throw new Error("EntityVectorAdapter.set_vec() not implemented");
}
/**
* Delete/remove the vector embedding for this entity.
* @async
* @returns {Promise<void>}
* @throws {Error} Not implemented by default.
*/
async delete_vec() {
throw new Error("EntityVectorAdapter.delete_vec() not implemented");
}
};

function cos_sim(vector1, vector2) {
if (vector1.length !== vector2.length) {
throw new Error("Vectors must have the same length");
}
let dot_product = 0;
let magnitude1 = 0;
let magnitude2 = 0;
const epsilon = 1e-8;
for (let i = 0; i < vector1.length; i++) {
dot_product += vector1[i] * vector2[i];
magnitude1 += vector1[i] * vector1[i];
magnitude2 += vector2[i] * vector2[i];
}
magnitude1 = Math.sqrt(magnitude1);
magnitude2 = Math.sqrt(magnitude2);
if (magnitude1 < epsilon || magnitude2 < epsilon) {
return 0;
}
return dot_product / (magnitude1 * magnitude2);
}

function results_acc(_acc, result, ct = 10) {
if (_acc.results.size < ct) {
_acc.results.add(result);
if (_acc.results.size === ct && _acc.min === Number.POSITIVE_INFINITY) {
let { minScore, minObj } = find_min(_acc.results);
_acc.min = minScore;
_acc.minResult = minObj;
}
} else if (result.score > _acc.min) {
_acc.results.add(result);
_acc.results.delete(_acc.minResult);
let { minScore, minObj } = find_min(_acc.results);
_acc.min = minScore;
_acc.minResult = minObj;
}
}
function furthest_acc(_acc, result, ct = 10) {
if (_acc.results.size < ct) {
_acc.results.add(result);
if (_acc.results.size === ct && _acc.max === Number.NEGATIVE_INFINITY) {
let { maxScore, maxObj } = find_max(_acc.results);
_acc.max = maxScore;
_acc.maxResult = maxObj;
}
} else if (result.score < _acc.max) {
_acc.results.add(result);
_acc.results.delete(_acc.maxResult);
let { maxScore, maxObj } = find_max(_acc.results);
_acc.max = maxScore;
_acc.maxResult = maxObj;
}
}
function find_min(results) {
let minScore = Number.POSITIVE_INFINITY;
let minObj = null;
for (const obj of results) {
if (obj.score < minScore) {
minScore = obj.score;
minObj = obj;
}
}
return { minScore, minObj };
}
function find_max(results) {
let maxScore = Number.NEGATIVE_INFINITY;
let maxObj = null;
for (const obj of results) {
if (obj.score > maxScore) {
maxScore = obj.score;
maxObj = obj;
}
}
return { maxScore, maxObj };
}

function sort_by_score(a, b) {
const epsilon = 1e-9;
const score_diff = a.score - b.score;
if (Math.abs(score_diff) < epsilon)
return 0;
return score_diff > 0 ? -1 : 1;
}
function sort_by_score_descending(a, b) {
return sort_by_score(a, b);
}
function sort_by_score_ascending(a, b) {
return sort_by_score(a, b) * -1;
}

var DefaultEntitiesVectorAdapter = class extends EntitiesVectorAdapter {
constructor(collection) {
super(collection);
this._is_processing_embed_queue = false;
this._reset_embed_queue_stats();
}
/**
* Find the nearest entities to the given vector.
* @async
* @param {number[]} vec - The reference vector.
* @param {Object} [filter={}] - Optional filters (limit, exclude, etc.)
* @returns {Promise<Array<{item:Object, score:number}>>} Array of results sorted by score descending.
*/
async nearest(vec, filter = {}) {
if (!vec || !Array.isArray(vec)) {
throw new Error("Invalid vector input to nearest()");
}
const {
limit = 50
} = filter;
const nearest = this.collection.filter(filter).reduce((acc, item) => {
if (!item.vec)
return acc;
const result = { item, score: cos_sim(vec, item.vec) };
results_acc(acc, result, limit);
return acc;
}, { min: 0, results: /* @__PURE__ */ new Set() });
return Array.from(nearest.results).sort(sort_by_score_descending);
}
/**
* Find the furthest entities from the given vector.
* @async
* @param {number[]} vec - The reference vector.
* @param {Object} [filter={}] - Optional filters (limit, exclude, etc.)
* @returns {Promise<Array<{item:Object, score:number}>>} Array of results sorted by score ascending (furthest).
*/
async furthest(vec, filter = {}) {
if (!vec || !Array.isArray(vec)) {
throw new Error("Invalid vector input to furthest()");
}
const {
limit = 50
} = filter;
const furthest = this.collection.filter(filter).reduce((acc, item) => {
if (!item.vec)
return acc;
const result = { item, score: cos_sim(vec, item.vec) };
furthest_acc(acc, result, limit);
return acc;
}, { max: 0, results: /* @__PURE__ */ new Set() });
return Array.from(furthest.results).sort(sort_by_score_ascending);
}
/**
* Embed a batch of entities.
* @async
* @param {Object[]} entities - Array of entity instances to embed.
* @returns {Promise<void>}
*/
async embed_batch(entities) {
if (!this.collection.embed_model) {
throw new Error("No embed_model found in collection for embedding");
}
await Promise.all(entities.map((e) => e.get_embed_input()));
const embeddings = await this.collection.embed_model.embed_batch(entities);
embeddings.forEach((emb, i) => {
const entity = entities[i];
entity.vec = emb.vec;
if (emb.tokens !== void 0)
entity.tokens = emb.tokens;
});
}
/**
* Process a queue of entities waiting to be embedded.
* Prevents multiple concurrent runs by using `_is_processing_embed_queue`.
* @async
* @returns {Promise<void>}
*/
async process_embed_queue() {
if (this._is_processing_embed_queue) {
console.log("process_embed_queue is already running, skipping concurrent call.");
return;
}
this._is_processing_embed_queue = true;
try {
const embed_queue = this.collection.embed_queue;
this._reset_embed_queue_stats();
if (this.collection.embed_model_key === "None") {
console.log(`Smart Connections: No active embedding model for ${this.collection.collection_key}, skipping embedding`);
return;
}
if (!this.collection.embed_model) {
console.log(`Smart Connections: No active embedding model for ${this.collection.collection_key}, skipping embedding`);
return;
}
const datetime_start = /* @__PURE__ */ new Date();
if (!embed_queue.length) {
console.log(`Smart Connections: No items in ${this.collection.collection_key} embed queue`);
return;
}
console.log(`Time spent getting embed queue: ${(/* @__PURE__ */ new Date()).getTime() - datetime_start.getTime()}ms`);
console.log(`Processing ${this.collection.collection_key} embed queue: ${embed_queue.length} items`);
for (let i = 0; i < embed_queue.length; i += this.collection.embed_model.batch_size) {
if (this.is_queue_halted) {
this.is_queue_halted = false;
break;
}
const batch = embed_queue.slice(i, i + this.collection.embed_model.batch_size);
await Promise.all(batch.map((item) => item.get_embed_input()));
try {
const start_time = Date.now();
await this.embed_batch(batch);
this.total_time += Date.now() - start_time;
} catch (e) {
if (e && e.message && e.message.includes("API key not set")) {
this.halt_embed_queue_processing(`API key not set for ${this.collection.embed_model_key}
Please set the API key in the settings.`);
}
console.error(e);
console.error(`Error processing ${this.collection.collection_key} embed queue: ` + JSON.stringify(e || {}, null, 2));
}
batch.forEach((item) => {
item.embed_hash = item.read_hash;
item._queue_save = true;
});
this.embedded_total += batch.length;
this.total_tokens += batch.reduce((acc, item) => acc + (item.tokens || 0), 0);
this._show_embed_progress_notice(embed_queue.length);
if (this.embedded_total - this.last_save_total > 1e3) {
this.last_save_total = this.embedded_total;
await this.collection.process_save_queue();
if (this.collection.block_collection) {
console.log(`Saving ${this.collection.block_collection.collection_key} block collection`);
await this.collection.block_collection.process_save_queue();
}
}
}
this._show_embed_completion_notice(embed_queue.length);
await this.collection.process_save_queue();
if (this.collection.block_collection) {
await this.collection.block_collection.process_save_queue();
}
} finally {
this._is_processing_embed_queue = false;
}
}
/**
* Displays the embedding progress notice.
* @private
* @returns {void}
*/
_show_embed_progress_notice(embed_queue_length) {
if (this.embedded_total - this.last_notice_embedded_total < 100)
return;
this.last_notice_embedded_total = this.embedded_total;
this.notices?.show("embedding_progress", {
progress: this.embedded_total,
total: embed_queue_length,
tokens_per_second: this._calculate_embed_tokens_per_second(),
model_name: this.collection.embed_model_key
});
}
/**
* Displays the embedding completion notice.
* @private
* @returns {void}
*/
_show_embed_completion_notice() {
this.notices?.remove("embedding_progress");
this.notices?.show("embedding_complete", {
total_embeddings: this.embedded_total,
tokens_per_second: this._calculate_embed_tokens_per_second(),
model_name: this.collection.embed_model_key
});
}
/**
* Halts the embed queue processing.
* @param {string|null} msg - Optional message.
*/
halt_embed_queue_processing(msg = null) {
this.is_queue_halted = true;
console.log("Embed queue processing halted");
this.notices?.remove("embedding_progress");
this.notices?.show("embedding_paused", {
progress: this.embedded_total,
total: this.collection._embed_queue.length,
tokens_per_second: this._calculate_embed_tokens_per_second(),
model_name: this.collection.embed_model_key
});
}
/**
* Resumes the embed queue processing after a delay.
* @param {number} [delay=0] - The delay in milliseconds before resuming.
* @returns {void}
*/
resume_embed_queue_processing(delay = 0) {
console.log("resume_embed_queue_processing");
this.notices?.remove("embedding_paused");
setTimeout(() => {
this.embedded_total = 0;
this.process_embed_queue();
}, delay);
}
/**
* Calculates the number of tokens processed per second.
* @private
* @returns {number} Tokens per second.
*/
_calculate_embed_tokens_per_second() {
const elapsed_time = this.total_time / 1e3;
return Math.round(this.total_tokens / (elapsed_time || 1));
}
/**
* Resets the statistics related to embed queue processing.
* @private
* @returns {void}
*/
_reset_embed_queue_stats() {
this.collection._embed_queue = [];
this.embedded_total = 0;
this.is_queue_halted = false;
this.last_save_total = 0;
this.last_notice_embedded_total = 0;
this.total_tokens = 0;
this.total_time = 0;
}
get notices() {
return this.collection.notices;
}
};
var DefaultEntityVectorAdapter = class extends EntityVectorAdapter {
get data() {
return this.item.data;
}
/**
* Retrieve the current vector embedding for this entity.
* @async
* @returns {Promise<number[]|undefined>} The entity's vector or undefined if not set.
*/
async get_vec() {
return this.vec;
}
/**
* Store/update the vector embedding for this entity.
* @async
* @param {number[]} vec - The vector to set.
* @returns {Promise<void>}
*/
async set_vec(vec) {
this.vec = vec;
}
/**
* Delete/remove the vector embedding for this entity.
* @async
* @returns {Promise<void>}
*/
async delete_vec() {
if (this.item.data?.embeddings?.[this.item.embed_model_key]) {
delete this.item.data.embeddings[this.item.embed_model_key].vec;
}
}
get vec() {
return this.item.data?.embeddings?.[this.item.embed_model_key]?.vec;
}
set vec(vec) {
if (!this.item.data.embeddings) {
this.item.data.embeddings = {};
}
if (!this.item.data.embeddings[this.item.embed_model_key]) {
this.item.data.embeddings[this.item.embed_model_key] = {};
}
this.item.data.embeddings[this.item.embed_model_key].vec = vec;
}
};

async function render2(entity, opts = {}) {
let markdown;
if (should_render_embed(entity))
markdown = `${entity.embed_link}

${await entity.read()}`;
else
markdown = process_for_rendering(await entity.read());
let frag;
if (entity.env.settings.smart_view_filter.render_markdown)
frag = await this.render_markdown(markdown, entity);
else
frag = this.create_doc_fragment(markdown);
return await post_process2.call(this, entity, frag, opts);
}
function process_for_rendering(content) {
if (content.includes("```dataview"))
content = content.replace(/```dataview/g, "```\\dataview");
if (content.includes("![["))
content = content.replace(/\!\[\[/g, "! [[");
return content;
}
async function post_process2(scope, frag, opts = {}) {
return frag;
}
function should_render_embed(entity) {
if (!entity)
return false;
if (entity.is_media)
return true;
return false;
}

async function find_connections(params = {}) {
const filter_opts = this.prepare_find_connections_filter_opts(params);
const limit = params.filter?.limit || params.limit || this.env.settings.smart_view_filter?.results_limit || 10;
const cache_key = this.key + JSON.stringify(params);
if (!this.env.connections_cache)
this.env.connections_cache = {};
if (!this.env.connections_cache[cache_key]) {
const connections = (await this.nearest(filter_opts)).sort(sort_by_score).slice(0, limit);
this.connections_to_cache(cache_key, connections);
}
return this.connections_from_cache(cache_key);
}

var SmartEntity = class extends CollectionItem {
/**
* Creates an instance of SmartEntity.
* @constructor
* @param {Object} env - The environment instance.
* @param {Object} [opts={}] - Configuration options.
*/
constructor(env, opts = {}) {
super(env, opts);
this.entity_adapter = new DefaultEntityVectorAdapter(this);
}
/**
* Provides default values for a SmartEntity instance.
* @static
* @readonly
* @returns {Object} The default values.
*/
static get defaults() {
return {
data: {
path: null,
last_embed: {
hash: null
},
embeddings: {}
}
};
}
get vector_adapter() {
if (!this._vector_adapter) {
this._vector_adapter = new this.collection.opts.vector_adapter.item(this);
}
return this._vector_adapter;
}
/**
* Initializes the SmartEntity instance.
* Checks if the entity has a vector and if it matches the model dimensions.
* If not, it queues an embed.
* Removes embeddings for inactive models.
* @returns {void}
*/
init() {
super.init();
if (!this.vec) {
this.queue_embed();
} else if (this.vec.length !== this.embed_model.model_config.dims) {
this.vec = null;
this.queue_embed();
}
Object.entries(this.data.embeddings || {}).forEach(([model, embedding]) => {
if (model !== this.embed_model_key) {
this.data.embeddings[model] = null;
delete this.data.embeddings[model];
}
});
}
/**
* Queues the entity for embedding.
* @returns {void}
*/
queue_embed() {
this._queue_embed = true;
}
/**
* Finds the nearest entities to this entity.
* @param {Object} [filter={}] - Optional filters to apply.
* @returns {Array<{item:Object, score:number}>} An array of result objects with score and item.
*/
async nearest(filter = {}) {
return await this.collection.nearest_to(this, filter);
}
/**
* Prepares the input for embedding.
* @async
* @param {string} [content=null] - Optional content to use instead of calling subsequent read()
* @returns {Promise<void>} Should be overridden in child classes.
*/
async get_embed_input(content = null) {
}
/**
* Retrieves the embed input, either from cache or by generating it.
* @readonly
* @returns {string|Promise<string>} The embed input string or a promise resolving to it.
*/
get embed_input() {
return this._embed_input ? this._embed_input : this.get_embed_input();
}
/**
* Prepares filter options for finding connections based on parameters.
* @param {Object} [params={}] - Parameters for finding connections.
* @returns {Object} The prepared filter options.
*/
prepare_find_connections_filter_opts(params = {}) {
const opts = {
...this.env.settings.smart_view_filter || {},
...params,
entity: this
};
if (opts.filter?.limit)
delete opts.filter.limit;
if (opts.limit)
delete opts.limit;
return opts;
}
/**
* Finds connections relevant to this entity based on provided parameters.
* @async
* @param {Object} [params={}] - Parameters for finding connections.
* @returns {Array<{item:Object, score:number}>} An array of result objects with score and item.
*/
async find_connections(params = {}) {
return await this.actions.find_connections(params);
}
/**
* Retrieves connections from the cache based on the cache key.
* @param {string} cache_key - The cache key.
* @returns {Array<{item:Object, score:number}>} The cached connections.
*/
connections_from_cache(cache_key) {
return this.env.connections_cache[cache_key];
}
/**
* Stores connections in the cache with the provided cache key.
* @param {string} cache_key - The cache key.
* @param {Array<{item:Object, score:number}>} connections - The connections to cache.
* @returns {void}
*/
connections_to_cache(cache_key, connections) {
this.env.connections_cache[cache_key] = connections;
}
get read_hash() {
return this.data.last_read?.hash;
}
set read_hash(hash) {
if (!this.data.last_read)
this.data.last_read = {};
this.data.last_read.hash = hash;
}
get embedding_data() {
if (!this.data.embeddings[this.embed_model_key]) {
this.data.embeddings[this.embed_model_key] = {};
}
return this.data.embeddings[this.embed_model_key];
}
get last_embed() {
if (!this.embedding_data.last_embed) {
this.embedding_data.last_embed = {};
if (this.data.last_embed) {
this.embedding_data.last_embed = this.data.last_embed;
delete this.data.last_embed;
this.queue_save();
}
}
return this.embedding_data.last_embed;
}
get embed_hash() {
return this.last_embed?.hash;
}
set embed_hash(hash) {
if (!this.embedding_data.last_embed)
this.embedding_data.last_embed = {};
this.embedding_data.last_embed.hash = hash;
}
/**
* Gets the embed link for the entity.
* @readonly
* @returns {string} The embed link.
*/
get embed_link() {
return `![[${this.path}]]`;
}
/**
* Gets the key of the embedding model.
* @readonly
* @returns {string} The embedding model key.
*/
get embed_model_key() {
return this.collection.embed_model_key;
}
/**
* Gets the name of the entity, formatted based on settings.
* @readonly
* @returns {string} The entity name.
*/
get name() {
return (!this.should_show_full_path ? this.path.split("/").pop() : this.path.split("/").join(" > ")).split("#").join(" > ").replace(".md", "");
}
/**
* Determines whether to show the full path of the entity.
* @readonly
* @returns {boolean} True if the full path should be shown, false otherwise.
*/
get should_show_full_path() {
return this.env.settings.smart_view_filter?.show_full_path;
}
/**
* @deprecated Use embed_model instead.
* @readonly
* @returns {Object} The smart embedding model.
*/
get smart_embed() {
return this.embed_model;
}
/**
* Gets the embedding model instance from the collection.
* @readonly
* @returns {Object} The embedding model instance.
*/
get embed_model() {
return this.collection.embed_model;
}
/**
* Determines if the entity should be embedded.
* @readonly
* @returns {boolean} True if no vector is set, false otherwise.
*/
get should_embed() {
return !this.vec && this.size > (this.settings?.min_chars || 300);
}
/**
* Sets the error for the embedding model.
* @param {string} error - The error message.
*/
set error(error) {
this.data.embeddings[this.embed_model_key].error = error;
}
/**
* Gets the number of tokens associated with the entity's embedding.
* @readonly
* @returns {number|undefined} The number of tokens, or undefined if not set.
*/
get tokens() {
return this.last_embed?.tokens;
}
/**
* Sets the number of tokens for the embedding.
* @param {number} tokens - The number of tokens.
*/
set tokens(tokens) {
this.last_embed.tokens = tokens;
}
/**
* Gets the vector representation from the entity adapter.
* @readonly
* @returns {Array<number>|undefined} The vector or undefined if not set.
*/
get vec() {
return this.entity_adapter.vec;
}
/**
* Sets the vector representation in the entity adapter.
* @param {Array<number>} vec - The vector to set.
*/
set vec(vec) {
this.entity_adapter.vec = vec;
this._queue_embed = false;
this._embed_input = null;
this.queue_save();
}
/**
* Removes all embeddings from the entity.
* @returns {void}
*/
remove_embeddings() {
this.data.embeddings = null;
this.queue_save();
}
/**
* Retrieves the key of the entity.
* @returns {string} The entity key.
*/
get_key() {
return this.data.key || this.data.path;
}
/**
* Retrieves the path of the entity.
* @readonly
* @returns {string|null} The entity path.
*/
get path() {
return this.data.path;
}
/**
* Gets the component responsible for rendering the entity.
* @readonly
* @returns {Function} The render function for the entity component.
*/
get component() {
return render2;
}
get is_unembedded() {
if (!this.vec)
return true;
if (!this.embed_hash || this.embed_hash !== this.read_hash)
return true;
return false;
}
get connections_component() {
if (!this._connections_component)
this._connections_component = this.components?.connections?.bind(this.smart_view);
return this._connections_component;
}
async render_connections(container, opts = {}) {
if (container)
container.innerHTML = "Loading connections...";
const frag = await this.env.render_component("connections", this, opts);
if (container) {
container.innerHTML = "";
container.appendChild(frag);
}
return frag;
}
};

var SmartEntities = class extends Collection {
/**
* Creates an instance of SmartEntities.
* @constructor
* @param {Object} env - The environment instance.
* @param {Object} opts - Configuration options.
*/
constructor(env, opts) {
super(env, opts);
this.entities_vector_adapter = new DefaultEntitiesVectorAdapter(this);
this.model_instance_id = null;
this._embed_queue = [];
}
/**
* Initializes the SmartEntities instance by loading embeddings.
* @async
* @returns {Promise<void>}
*/
async init() {
await super.init();
await this.load_smart_embed();
if (!this.embed_model) {
console.log(`SmartEmbed not loaded for **${this.collection_key}**. Continuing without embedding capabilities.`);
}
}
/**
* Loads the smart embedding model.
* @async
* @returns {Promise<void>}
*/
async load_smart_embed() {
if (this.embed_model_key === "None")
return;
if (!this.embed_model)
return;
if (this.embed_model.is_loading)
return console.log(`SmartEmbedModel already loading for ${this.embed_model_key}`);
if (this.embed_model.is_loaded)
return console.log(`SmartEmbedModel already loaded for ${this.embed_model_key}`);
try {
console.log(`Loading SmartEmbedModel in ${this.collection_key}, current state: ${this.embed_model.state}`);
await this.embed_model.load();
} catch (e) {
console.error(`Error loading SmartEmbedModel for ${this.embed_model.model_key}`);
console.error(e);
}
}
/**
* Unloads the smart embedding model.
* @async
* @returns {Promise<void>}
*/
async unload() {
if (typeof this.embed_model?.unload === "function") {
this.embed_model.unload();
}
super.unload();
}
/**
* Gets the key of the embedding model.
* @readonly
* @returns {string} The embedding model key.
*/
get embed_model_key() {
return this.embed_model?.model_key;
}
/**
* Gets or creates the container for smart embeddings in the DOM.
* @readonly
* @returns {HTMLElement|undefined} The container element or undefined if not available.
*/
get smart_embed_container() {
if (!this.model_instance_id)
return console.log("model_key not set");
const id = this.model_instance_id.replace(/[^a-zA-Z0-9]/g, "_");
if (!window.document)
return console.log("window.document not available");
if (window.document.querySelector(`#${id}`))
return window.document.querySelector(`#${id}`);
const container = window.document.createElement("div");
container.id = id;
window.document.body.appendChild(container);
return container;
}
/**
* @deprecated Use embed_model instead.
* @readonly
* @returns {Object} The smart embedding model.
*/
get smart_embed() {
return this.embed_model;
}
/**
* Gets the embedding model instance.
* @readonly
* @returns {Object|null} The embedding model instance or null if none.
*/
get embed_model() {
if (!this.env._embed_model && this.env.opts.modules.smart_embed_model?.class)
this.env._embed_model = new this.env.opts.modules.smart_embed_model.class({
settings: this.settings.embed_model,
adapters: this.env.opts.modules.smart_embed_model?.adapters,
re_render_settings: this.re_render_settings.bind(this),
reload_model: this.reload_embed_model.bind(this)
});
return this.env._embed_model;
}
set embed_model(embed_model) {
this.env._embed_model = embed_model;
}
reload_embed_model() {
console.log("reload_embed_model");
this.embed_model.unload();
this.env._embed_model = null;
}
re_render_settings() {
this.settings_container.innerHTML = "";
this.render_settings();
}
/**
* Finds the nearest entities to a given entity.
* @async
* @param {Object} entity - The reference entity.
* @param {Object} [filter={}] - Optional filters to apply.
* @returns {Promise<Array<{item:Object, score:number}>>} An array of result objects with score and item.
*/
async nearest_to(entity, filter = {}) {
return await this.nearest(entity.vec, filter);
}
/**
* Finds the nearest entities to a vector using the default adapter.
* @async
* @param {Array<number>} vec - The vector to compare against.
* @param {Object} [filter={}] - Optional filters to apply.
* @returns {Promise<Array<{item:Object, score:number}>>} An array of result objects with score and item.
*/
async nearest(vec, filter = {}) {
if (!vec) {
console.warn("nearest: no vec");
return [];
}
return await this.entities_vector_adapter.nearest(vec, filter);
}
/**
* Finds the furthest entities from a vector using the default adapter.
* @async
* @param {Array<number>} vec - The vector to compare against.
* @param {Object} [filter={}] - Optional filters to apply.
* @returns {Promise<Array<{item:Object, score:number}>>} An array of result objects with score and item.
*/
async furthest(vec, filter = {}) {
if (!vec)
return console.warn("furthest: no vec");
return await this.entities_vector_adapter.furthest(vec, filter);
}
/**
* Gets the file name based on collection key and embedding model key.
* @readonly
* @returns {string} The constructed file name.
*/
get file_name() {
return this.collection_key + "-" + this.embed_model_key.split("/").pop();
}
/**
* Calculates the relevance of an item based on the search filter.
* @param {Object} item - The item to calculate relevance for.
* @param {Object} search_filter - The search filter containing keywords.
* @returns {number} The relevance score:
*                   1 if any keyword is found in the item's path,
*                   0 otherwise (default relevance for keyword in content).
*/
calculate_relevance(item, search_filter) {
if (search_filter.keywords.some((keyword) => item.path?.includes(keyword)))
return 1;
return 0;
}
/**
* Prepares the filter options by incorporating entity-based filters.
* @param {Object} [opts={}] - The filter options.
* @param {Object} [opts.entity] - The entity to base the filters on.
* @param {string|string[]} [opts.exclude_filter] - Keys or prefixes to exclude.
* @param {string|string[]} [opts.include_filter] - Keys or prefixes to include.
* @param {boolean} [opts.exclude_inlinks] - Whether to exclude inlinks of the entity.
* @param {boolean} [opts.exclude_outlinks] - Whether to exclude outlinks of the entity.
* @returns {Object} The modified filter options.
*/
prepare_filter(opts = {}) {
const {
entity,
exclude_filter,
include_filter,
exclude_inlinks,
exclude_outlinks
} = opts;
if (entity) {
if (typeof opts.exclude_key_starts_with_any === "undefined")
opts.exclude_key_starts_with_any = [];
if (opts.exclude_key_starts_with) {
opts.exclude_key_starts_with_any = [
opts.exclude_key_starts_with
];
delete opts.exclude_key_starts_with;
}
opts.exclude_key_starts_with_any.push(entity.source_key || entity.key);
if (exclude_filter) {
if (!Array.isArray(opts.exclude_key_includes_any))
opts.exclude_key_includes_any = [];
if (typeof exclude_filter === "string")
opts.exclude_key_includes_any.push(exclude_filter);
else if (exclude_filter.includes(","))
opts.exclude_key_includes_any.push(...exclude_filter.split(","));
}
if (include_filter) {
if (!Array.isArray(opts.key_includes_any))
opts.key_includes_any = [];
if (typeof include_filter === "string")
opts.key_includes_any.push(include_filter);
else if (include_filter.includes(","))
opts.key_includes_any.push(...include_filter.split(","));
}
if (exclude_inlinks && entity?.inlinks?.length) {
if (!Array.isArray(opts.exclude_key_starts_with_any))
opts.exclude_key_starts_with_any = [];
opts.exclude_key_starts_with_any.push(...entity.inlinks);
}
if (exclude_outlinks && entity?.outlinks?.length) {
if (!Array.isArray(opts.exclude_key_starts_with_any))
opts.exclude_key_starts_with_any = [];
opts.exclude_key_starts_with_any.push(...entity.outlinks);
}
}
return opts;
}
/**
* Looks up entities based on hypothetical content.
* @async
* @param {Object} [params={}] - The parameters for the lookup.
* @param {Array<string>} [params.hypotheticals=[]] - The hypothetical content to lookup.
* @param {Object} [params.filter] - The filter to use for the lookup.
* @param {number} [params.k] - Deprecated: Use `filter.limit` instead.
* @returns {Promise<Array<Result>|Object>} The lookup results or an error object.
*/
async lookup(params = {}) {
const { hypotheticals = [] } = params;
if (!hypotheticals?.length)
return { error: "hypotheticals is required" };
if (!this.embed_model)
return { error: "Embedding search is not enabled." };
const hyp_vecs = await this.embed_model.embed_batch(hypotheticals.map((h) => ({ embed_input: h })));
const limit = params.filter?.limit || params.k || this.env.settings.lookup_k || 10;
if (params.filter?.limit)
delete params.filter.limit;
const filter = {
...this.env.chats?.current?.scope || {},
...params.filter || {}
};
const results = await hyp_vecs.reduce(async (acc_promise, embedding, i) => {
const acc = await acc_promise;
const results2 = await this.nearest(embedding.vec, filter);
results2.forEach((result) => {
if (!acc[result.item.path] || result.score > acc[result.item.path].score) {
acc[result.item.path] = {
key: result.item.key,
score: result.score,
item: result.item,
hypothetical_i: i
};
} else {
result.score = acc[result.item.path].score;
}
});
return acc;
}, Promise.resolve({}));
console.log(results);
const top_k = Object.values(results).sort(sort_by_score).slice(0, limit);
console.log(`Found and returned ${top_k.length} ${this.collection_key}.`);
return top_k;
}
/**
* Gets the configuration for settings.
* @readonly
* @returns {Object} The settings configuration.
*/
get settings_config() {
return settings_config;
}
async render_settings(container = this.settings_container, opts = {}) {
container = await this.render_collection_settings(container, opts);
const embed_model_settings_frag = await this.env.render_component("settings", this.embed_model, opts);
container.appendChild(embed_model_settings_frag);
return container;
}
/**
* Gets the notices from the environment.
* @readonly
* @returns {Object} The notices object.
*/
get notices() {
return this.env.smart_connections_plugin?.notices || this.env.main?.notices;
}
/**
* Gets the embed queue containing items to be embedded.
* @readonly
* @returns {Array<Object>} The embed queue.
*/
get embed_queue() {
if (!this._embed_queue?.length)
this._embed_queue = Object.values(this.items).filter((item) => item._queue_embed && item.should_embed);
return this._embed_queue;
}
/**
* Processes the embed queue by delegating to the default vector adapter.
* @async
* @returns {Promise<void>}
*/
async process_embed_queue() {
await this.entities_vector_adapter.process_embed_queue();
}
/**
* Handles changes to the embedding model by reinitializing and processing the load queue.
* @async
* @returns {Promise<void>}
*/
async embed_model_changed() {
await this.unload();
await this.init();
this.render_settings();
await this.process_load_queue();
}
get connections_filter_config() {
return connections_filter_config;
}
};
var settings_config = {
"min_chars": {
name: "Minimum length",
type: "number",
description: "Minimum length of entity to embed (in characters).",
placeholder: "Enter number ex. 300",
default: 300
}
};
var connections_filter_config = {
"smart_view_filter.show_full_path": {
"name": "Show full path",
"type": "toggle",
"description": "Show full path in view."
},
"smart_view_filter.render_markdown": {
"name": "Render markdown",
"type": "toggle",
"description": "Render markdown in results."
},
"smart_view_filter.results_limit": {
"name": "Results limit",
"type": "number",
"description": "Limit the number of results.",
"default": 20
},
"smart_view_filter.exclude_inlinks": {
"name": "Exclude inlinks (backlinks)",
"type": "toggle",
"description": "Exclude notes that link to the current note."
},
"smart_view_filter.exclude_outlinks": {
"name": "Exclude outlinks",
"type": "toggle",
"description": "Exclude links already in the current document."
},
"smart_view_filter.include_filter": {
"name": "Include filter",
"type": "text",
"description": "Require that result file path matches this value."
},
"smart_view_filter.exclude_filter": {
"name": "Exclude filter",
"type": "text",
"description": "Exclude results with file path that matches this value."
}
};

async function render3(source, opts = {}) {
let markdown;
if (should_render_embed(source))
markdown = source.embed_link;
else
markdown = process_for_rendering(await source.read());
let frag;
if (source.env.settings.smart_view_filter.render_markdown)
frag = await this.render_markdown(markdown, source);
else
frag = this.create_doc_fragment(`<span>${markdown}</span>`);
return await post_process2.call(this, source, frag, opts);
}

async function create_hash(text) {
if (text.length > 1e5)
text = text.substring(0, 1e5);
const msgUint8 = new TextEncoder().encode(text.trim());
const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
const hashArray = Array.from(new Uint8Array(hashBuffer));
const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
return hashHex;
}

async function find_connections2(params = {}) {
let connections;
if (this.block_collection.settings.embed_blocks && params.exclude_source_connections)
connections = [];
else
connections = await find_connections.call(this, params);
const filter_opts = this.prepare_find_connections_filter_opts(params);
const limit = params.filter?.limit || params.limit || this.env.settings.smart_view_filter?.results_limit || 20;
if (params.filter?.limit)
delete params.filter.limit;
if (params.limit)
delete params.limit;
if (!params.exclude_blocks_from_source_connections) {
const cache_key = this.key + JSON.stringify(params) + "_blocks";
if (!this.env.connections_cache)
this.env.connections_cache = {};
if (!this.env.connections_cache[cache_key]) {
const nearest = (await this.env.smart_blocks.nearest(this.vec, filter_opts)).sort(sort_by_score).slice(0, limit);
this.connections_to_cache(cache_key, nearest);
}
connections = [
...connections,
...this.connections_from_cache(cache_key)
].sort(sort_by_score).slice(0, limit);
}
return connections;
}

var SmartSource = class extends SmartEntity {
/**
* Provides default values for a SmartSource instance.
* @static
* @readonly
* @returns {Object} The default values.
*/
static get defaults() {
return {
data: {
last_read: {
hash: null,
mtime: 0
},
embeddings: {}
},
_embed_input: null,
_queue_load: true
};
}
/**
* Initializes the SmartSource instance by queuing an import if blocks are missing.
* @returns {void}
*/
init() {
super.init();
if (!this.data.blocks)
this.queue_import();
}
/**
* Queues the SmartSource for import.
* @returns {void}
*/
queue_import() {
this._queue_import = true;
}
/**
* Imports the SmartSource by checking for updates and parsing content.
* @async
* @returns {Promise<void>}
*/
async import() {
this._queue_import = false;
try {
await this.source_adapter.import();
} catch (err) {
if (err.code === "ENOENT") {
console.log(`Smart Connections: Deleting ${this.path} data because it no longer exists on disk`);
this.delete();
} else {
console.warn("Smart Connections: Error during import: re-queueing import", err);
this.queue_import();
}
}
}
async parse_content(content = null) {
if (this.block_collection && typeof this.block_collection.import_source === "function") {
await this.block_collection.import_source(this, content);
}
const parse_fns = this.env?.opts?.collections?.smart_sources?.content_parsers || [];
for (const fn of parse_fns) {
await fn(this, content);
}
if (this.data.last_import?.hash === this.data.last_read?.hash) {
if (this.data.blocks)
return;
}
}
/**
* Finds connections relevant to this SmartSource based on provided parameters.
* @async
* @param {Object} [params={}] - Parameters for finding connections.
* @param {boolean} [params.exclude_source_connections=false] - Whether to exclude source connections.
* @param {boolean} [params.exclude_blocks_from_source_connections=false] - Whether to exclude block connections from source connections.
* @returns {Array<SmartSource>} An array of relevant SmartSource entities.
*/
async find_connections(params = {}) {
return await this.actions.find_connections(params);
}
/**
* Prepares the embed input for the SmartSource by reading content and applying exclusions.
* @async
* @returns {Promise<string|false>} The embed input string or `false` if already embedded.
*/
async get_embed_input(content = null) {
if (typeof this._embed_input === "string" && this._embed_input.length)
return this._embed_input;
if (!content)
content = await this.read();
if (this.excluded_lines.length) {
const content_lines = content.split("\n");
this.excluded_lines.forEach((lines) => {
const { start, end } = lines;
for (let i = start; i <= end; i++) {
content_lines[i] = "";
}
});
content = content_lines.filter((line) => line.length).join("\n");
}
const breadcrumbs = this.path.split("/").join(" > ").replace(".md", "");
const max_tokens = this.collection.embed_model.model_config.max_tokens || 500;
this._embed_input = `${breadcrumbs}:
${content}`.substring(0, max_tokens * 4);
return this._embed_input;
}
/**
* Opens the SmartSource note in the SmartConnections plugin.
* @returns {void}
*/
open() {
this.env.smart_connections_plugin.open_note(this.path);
}
/**
* Retrieves the block associated with a specific line number.
* @param {number} line - The line number to search for.
* @returns {SmartBlock|null} The corresponding SmartBlock or `null` if not found.
*/
get_block_by_line(line) {
return Object.entries(this.data.blocks || {}).reduce((acc, [sub_key, range]) => {
if (acc)
return acc;
if (range[0] <= line && range[1] >= line) {
const block = this.block_collection.get(this.key + sub_key);
if (block?.vec)
return block;
}
return acc;
}, null);
}
/**
* Checks if the source file exists in the file system.
* @async
* @returns {Promise<boolean>} A promise that resolves to `true` if the file exists, `false` otherwise.
*/
async has_source_file() {
return await this.fs.exists(this.path);
}
/**
* FILTER/SEARCH METHODS
*/
/**
* Searches for keywords within the entity's data and content.
* @async
* @param {Object} search_filter - The search filter object.
* @param {string[]} search_filter.keywords - An array of keywords to search for.
* @param {string} [search_filter.type='any'] - The type of search to perform. 'any' counts all matching keywords, 'all' counts only if all keywords match.
* @returns {Promise<number>} A promise that resolves to the number of matching keywords.
*/
async search(search_filter = {}) {
const { keywords, type = "any", limit } = search_filter;
if (!keywords || !Array.isArray(keywords)) {
console.warn("Entity.search: keywords not set or is not an array");
return 0;
}
if (limit && this.collection.search_results_ct >= limit)
return 0;
const lowercased_keywords = keywords.map((keyword) => keyword.toLowerCase());
const content = await this.read();
const lowercased_content = content.toLowerCase();
const lowercased_path = this.path.toLowerCase();
const matching_keywords = lowercased_keywords.filter(
(keyword) => lowercased_path.includes(keyword) || lowercased_content.includes(keyword)
);
if (type === "all") {
return matching_keywords.length === lowercased_keywords.length ? matching_keywords.length : 0;
} else {
return matching_keywords.length;
}
}
/**
* ADAPTER METHODS
*/
/**
* Appends content to the end of the source file.
* @async
* @param {string} content - The content to append to the file.
* @returns {Promise<void>} A promise that resolves when the operation is complete.
*/
async append(content) {
await this.source_adapter.append(content);
await this.import();
}
/**
* Updates the entire content of the source file.
* @async
* @param {string} full_content - The new content to write to the file.
* @param {Object} [opts={}] - Additional options for the update.
* @returns {Promise<void>} A promise that resolves when the operation is complete.
*/
async update(full_content, opts = {}) {
try {
await this.source_adapter.update(full_content, opts);
await this.import();
} catch (error) {
console.error("Error during update:", error);
throw error;
}
}
/**
* Reads the entire content of the source file.
* @async
* @param {Object} [opts={}] - Additional options for reading.
* @returns {Promise<string>} A promise that resolves with the content of the file.
*/
async read(opts = {}) {
try {
const content = await this.source_adapter.read(opts);
return content;
} catch (error) {
console.error("Error during read:", error);
throw error;
}
}
/**
* Removes the source file from the file system and deletes the entity.
* This is different from `delete()` because it also removes the source file.
* @async
* @returns {Promise<void>} A promise that resolves when the operation is complete.
*/
async remove() {
try {
await this.source_adapter.remove();
} catch (error) {
console.error("Error during remove:", error);
throw error;
}
}
/**
* Moves the current source to a new location.
* Handles the destination as a string (new path) or entity (block or source).
*
* @async
* @param {string|Object|SmartEntity} entity_ref - The destination path or entity to move to.
* @throws {Error} If the entity reference is invalid.
* @returns {Promise<void>} A promise that resolves when the move operation is complete.
*/
async move_to(entity_ref) {
try {
await this.source_adapter.move_to(entity_ref);
} catch (error) {
console.error("error_during_move:", error);
throw error;
}
}
/**
* Merges the given content into the current source.
* Parses the content into blocks and either appends to existing blocks, replaces blocks, or replaces all content.
*
* @async
* @param {string} content - The content to merge into the current source.
* @param {Object} [opts={}] - Options object.
* @param {string} [opts.mode='append'] - The merge mode: 'append', 'replace_blocks', or 'replace_all'.
* @returns {Promise<void>}
*/
async merge(content, opts = {}) {
try {
await this.source_adapter.merge(content, opts);
await this.import();
} catch (error) {
console.error("Error during merge:", error);
throw error;
}
}
/**
* Handles errors during the load process.
* @param {Error} err - The error encountered during load.
* @returns {void}
*/
on_load_error(err) {
super.on_load_error(err);
if (err.code === "ENOENT") {
this._queue_load = false;
this.queue_import();
}
}
/**
* Retrieves the block collection associated with SmartSources.
* @readonly
* @returns {SmartBlocks} The block collection instance.
*/
get block_collection() {
return this.env.smart_blocks;
}
/**
* Retrieves the vector representations of all blocks within the SmartSource.
* @readonly
* @returns {Array<Array<number>>} An array of vectors.
*/
get block_vecs() {
return this.blocks.map((block) => block.vec).filter((vec) => vec);
}
/**
* Retrieves all blocks associated with the SmartSource.
* @readonly
* @returns {Array<SmartBlock>} An array of SmartBlock instances.
* @description
* Uses block refs (Fastest) to get blocks without iterating over all blocks
*/
get blocks() {
if (this.data.blocks)
return this.block_collection.get_many(Object.keys(this.data.blocks).map((key) => this.key + key));
return [];
}
/**
* Determines if the SmartSource is excluded from processing.
* @readonly
* @returns {boolean} `true` if excluded, `false` otherwise.
*/
get excluded() {
return this.fs.is_excluded(this.path);
}
/**
* Retrieves the lines excluded from embedding.
* @readonly
* @returns {Array<Object>} An array of objects with `start` and `end` line numbers.
*/
get excluded_lines() {
return this.blocks.filter((block) => block.excluded).map((block) => block.lines);
}
/**
* Retrieves the file system instance from the SmartSource's collection.
* @readonly
* @returns {SmartFS} The file system instance.
*/
get fs() {
return this.collection.fs;
}
/**
* Retrieves the file object associated with the SmartSource.
* @readonly
* @returns {Object} The file object.
*/
get file() {
return this.fs.files[this.path];
}
/**
* Retrieves the file name of the SmartSource.
* @readonly
* @returns {string} The file name.
*/
get file_name() {
return this.path.split("/").pop();
}
/**
* Retrieves the file path of the SmartSource.
* @readonly
* @returns {string} The file path.
*/
get file_path() {
return this.path;
}
/**
* Retrieves the file type based on the file extension.
* @readonly
* @returns {string} The file type in lowercase.
*/
get file_type() {
if (!this._ext) {
this._ext = this.collection.get_extension_for_path(this.path) || "md";
}
return this._ext;
}
/**
* Retrieves the modification time of the SmartSource.
* @readonly
* @returns {number} The modification time.
*/
get mtime() {
return this.file?.stat?.mtime || 0;
}
/**
* Retrieves the size of the SmartSource.
* @readonly
* @returns {number} The size.
*/
get size() {
return this.file?.stat?.size || 0;
}
/**
* Retrieves the last import stat of the SmartSource.
* @readonly
* @returns {Object} The last import stat.
*/
get last_import() {
return this.data?.last_import;
}
/**
* Retrieves the last import modification time of the SmartSource.
* @readonly
* @returns {number} The last import modification time.
*/
get last_import_mtime() {
return this.last_import?.mtime || 0;
}
/**
* Retrieves the last import size of the SmartSource.
* @readonly
* @returns {number} The last import size.
*/
get last_import_size() {
return this.last_import?.size || 0;
}
/**
* Retrieves the paths of inlinks to this SmartSource.
* @readonly
* @returns {Array<string>} An array of inlink paths.
*/
get inlinks() {
return Object.keys(this.collection.links?.[this.path] || {});
}
get is_media() {
return this.source_adapter.is_media || false;
}
/**
* Determines if the SmartSource is gone (i.e., the file no longer exists).
* @readonly
* @returns {boolean} `true` if gone, `false` otherwise.
*/
get is_gone() {
return !this.file;
}
/**
* Retrieves the last read hash of the SmartSource.
* @readonly
* @returns {string|undefined} The last read hash or `undefined` if not set.
*/
get last_read() {
return this.data.last_read;
}
get metadata() {
return this.data.metadata;
}
/**
* Retrieves the display name of the SmartSource.
* @readonly
* @returns {string} The display name.
*/
get name() {
if (this.should_show_full_path)
return this.path.split("/").join(" > ").replace(".md", "");
return this.path.split("/").pop().replace(".md", "");
}
get outdated() {
return this.source_adapter.outdated;
}
/**
* Retrieves the outlink paths from the SmartSource.
* @readonly
* @returns {Array<string>} An array of outlink paths.
*/
get outlinks() {
return (this.data.outlinks || []).map((link) => {
const link_ref = link?.target || link;
if (link_ref.startsWith("http"))
return null;
const link_path = this.fs.get_link_target_path(link_ref, this.file_path);
return link_path;
}).filter((link_path) => link_path);
}
get path() {
return this.data.path || this.data.key;
}
get should_embed() {
return !this.vec || !this.embed_hash || this.embed_hash !== this.read_hash;
}
get source_adapters() {
return this.collection.source_adapters;
}
get source_adapter() {
if (this._source_adapter)
return this._source_adapter;
if (this.source_adapters[this.file_type])
this._source_adapter = new this.source_adapters[this.file_type](this);
else {
console.log("No source adapter found for", this.file_type, this);
}
return this._source_adapter;
}
/**
* Retrieves the component responsible for rendering the SmartSource.
* @readonly
* @returns {Function} The render function for the source component.
*/
get component() {
return render3;
}
/**
* Calculates the mean vector of all blocks within the SmartSource.
* @readonly
* @returns {Array<number>|null} The mean vector or `null` if no vectors are present.
*/
get mean_block_vec() {
return this._mean_block_vec ? this._mean_block_vec : this._mean_block_vec = this.block_vecs.reduce((acc, vec) => acc.map((val, i) => val + vec[i]), Array(384).fill(0)).map((val) => val / this.block_vecs.length);
}
/**
* Calculates the median vector of all blocks within the SmartSource.
* @readonly
* @returns {Array<number>|null} The median vector or `null` if no vectors are present.
*/
get median_block_vec() {
if (this._median_block_vec)
return this._median_block_vec;
if (!this.block_vecs.length)
return null;
const vec_length = this.block_vecs[0].length;
this._median_block_vec = new Array(vec_length);
const mid = Math.floor(this.block_vecs.length / 2);
for (let i = 0; i < vec_length; i++) {
const values = this.block_vecs.map((vec) => vec[i]).sort((a, b) => a - b);
this._median_block_vec[i] = this.block_vecs.length % 2 !== 0 ? values[mid] : (values[mid - 1] + values[mid]) / 2;
}
return this._median_block_vec;
}
/**
* @async
* @deprecated Use `read` instead.
* @returns {Promise<string>} A promise that resolves with the content of the file.
*/
async _read() {
return await this.source_adapter._read();
}
/**
* @async
* @deprecated Use `remove` instead.
* @returns {Promise<void>} A promise that resolves when the entity is destroyed.
*/
async destroy() {
await this.remove();
}
/**
* @async
* @deprecated Use `update` instead.
* @param {string} content - The content to update.
* @returns {Promise<void>}
*/
async _update(content) {
await this.source_adapter.update(content);
}
/**
* @deprecated Use `source` instead.
* @readonly
* @returns {SmartSource} The associated SmartSource instance.
*/
get t_file() {
return this.fs.files[this.path];
}
};
var smart_source_default = {
class: SmartSource,
actions: {
find_connections: find_connections2
}
};

var SmartSources = class extends SmartEntities {
/**
* Creates an instance of SmartSources.
* @constructor
* @param {Object} env - The environment instance.
* @param {Object} [opts={}] - Configuration options.
*/
constructor(env, opts = {}) {
super(env, opts);
this.search_results_ct = 0;
this._excluded_headings = null;
}
/**
* Initializes the SmartSources instance by performing an initial scan of sources.
* @async
* @returns {Promise<void>}
*/
async init() {
await super.init();
await this.init_items();
}
/**
* Initializes items by letting each adapter do any necessary file-based scanning.
* Adapters that do not rely on file scanning can skip or do nothing.
* @async
* @returns {Promise<void>}
*/
async init_items() {
this.show_process_notice("initial_scan");
for (const AdapterClass of Object.values(this.source_adapters)) {
if (typeof AdapterClass.init_items === "function") {
await AdapterClass.init_items(this);
}
}
this.clear_process_notice("initial_scan");
this.notices?.show("done_initial_scan", { collection_key: this.collection_key });
}
/**
* Creates (or returns existing) a SmartSource for a given file path, if the extension is recognized.
* @param {string} file_path - The path to the file or pseudo-file
* @returns {SmartSource|undefined} The newly created or existing SmartSource, or undefined if no recognized extension
*/
init_file_path(file_path) {
const ext = this.get_extension_for_path(file_path);
if (!ext) {
return;
}
if (this.items[file_path])
return this.items[file_path];
const item = new this.item_type(this.env, { path: file_path });
this.items[file_path] = item;
item.queue_import();
item.queue_load();
return item;
}
/**
* Looks for an extension in descending order:
* e.g. split "my.file.name.github" -> ["my","file","name","github"]
* Try 'file.name.github', 'name.github', 'github'
* Return the first that is in 'source_adapters'
* @param {string} file_path
* @returns {string|undefined} recognized extension, or undefined if none
*/
get_extension_for_path(file_path) {
if (!file_path)
return void 0;
const pcs = file_path.split(".");
if (pcs.length < 2)
return void 0;
pcs.shift();
while (pcs.length) {
const test_ext = pcs.join(".").toLowerCase();
if (this.source_adapters[test_ext]) {
return test_ext;
}
pcs.shift();
}
return void 0;
}
/**
* Builds a map of links between sources.
* @returns {Object} An object mapping link paths to source keys.
*/
build_links_map() {
const start_time = Date.now();
this.links = {};
for (const source of Object.values(this.items)) {
for (const link of source.outlinks) {
if (!this.links[link])
this.links[link] = {};
this.links[link][source.key] = true;
}
}
const end_time = Date.now();
console.log(`Time spent building links: ${end_time - start_time}ms`);
return this.links;
}
/**
* Creates a new source with the given key and content.
* @async
* @param {string} key - The key (path) of the new source.
* @param {string} content - The content to write to the new source.
* @returns {Promise<SmartSource>} The created SmartSource instance.
*/
async create(key, content) {
await this.fs.write(key, content);
await this.fs.refresh();
const source = await this.create_or_update({ path: key });
await source.import();
return source;
}
/**
* Performs a lexical search for matching SmartSource content.
* @async
* @param {Object} search_filter - The filter criteria for the search.
* @param {string[]} search_filter.keywords - An array of keywords to search for.
* @param {number} [search_filter.limit] - The maximum number of results to return.
* @returns {Promise<Array<SmartSource>>} A promise that resolves to an array of matching SmartSource entities.
*/
async search(search_filter = {}) {
const {
keywords,
limit,
...filter_opts
} = search_filter;
if (!keywords) {
console.warn("search_filter.keywords not set");
return [];
}
this.search_results_ct = 0;
const initial_results = this.filter(filter_opts);
const search_results = [];
for (let i = 0; i < initial_results.length; i += 10) {
const batch = initial_results.slice(i, i + 10);
const batch_results = await Promise.all(
batch.map(async (item) => {
try {
const matches = await item.search(search_filter);
if (matches) {
this.search_results_ct++;
return { item, score: matches };
} else
return null;
} catch (error) {
console.error(`Error searching item ${item.id || "unknown"}:`, error);
return null;
}
})
);
search_results.push(...batch_results.filter(Boolean));
}
return search_results.sort((a, b) => b.score - a.score).map((result) => result.item);
}
/**
* Looks up entities based on the provided parameters.
* @async
* @param {Object} [params={}] - Parameters for the lookup.
* @param {Object} [params.filter] - Filter options.
* @param {number} [params.k] - Deprecated. Use `params.filter.limit` instead.
* @returns {Promise<Array<SmartSource>>} A promise that resolves to an array of matching SmartSource entities.
*/
async lookup(params = {}) {
const limit = params.filter?.limit || params.k || this.env.settings.lookup_k || 10;
if (params.filter?.limit)
delete params.filter.limit;
let results = await super.lookup(params);
if (results.error) {
console.warn(results.error);
return [];
}
if (this.block_collection?.settings?.embed_blocks) {
results = [
...results,
...await this.block_collection.lookup(params)
].sort(sort_by_score);
}
console.log(results);
return results.slice(0, limit);
}
/**
* Processes the load queue by loading items and optionally importing them.
* Called after a "re-load" from settings, or after environment init.
* @async
* @returns {Promise<void>}
*/
async process_load_queue() {
await super.process_load_queue();
if (this.collection_key === "smart_sources" && this.env.smart_blocks) {
Object.values(this.env.smart_blocks.items).forEach((item) => item.init());
}
if (this.block_collection) {
this.block_collection.loaded = Object.keys(this.block_collection.items).length;
}
if (!this.opts.prevent_import_on_load) {
await this.process_source_import_queue(this.opts);
}
this.build_links_map();
}
/**
* @method process_source_import_queue
* @description
* Imports items (SmartSources or SmartBlocks) that have been flagged for import.
*/
async process_source_import_queue(opts = {}) {
const { process_embed_queue = true, force = false } = opts;
if (force)
Object.values(this.items).forEach((item) => item._queue_import = true);
const import_queue = Object.values(this.items).filter((item) => item._queue_import);
console.log("import_queue " + import_queue.length);
if (import_queue.length) {
const time_start = Date.now();
for (let i = 0; i < import_queue.length; i += 100) {
this.notices?.show("import_progress", {
progress: i,
total: import_queue.length
});
await Promise.all(import_queue.slice(i, i + 100).map((item) => item.import()));
}
setTimeout(() => {
this.notices?.remove("import_progress");
}, 1e3);
this.notices?.show("done_import", {
count: import_queue.length,
time_in_seconds: (Date.now() - time_start) / 1e3
});
} else {
this.notices?.show("no_import_queue");
}
this.build_links_map();
if (process_embed_queue)
await this.process_embed_queue();
else
console.log("skipping process_embed_queue");
await this.process_save_queue();
await this.block_collection?.process_save_queue();
}
/**
* Retrieves the source adapters based on the collection configuration.
* @readonly
* @returns {Object} An object mapping file extensions to adapter constructors.
*/
get source_adapters() {
if (!this._source_adapters) {
const source_adapters = Object.values(this.env.opts.collections?.[this.collection_key]?.source_adapters || {});
const _source_adapters = source_adapters.reduce((acc, adapter) => {
adapter.extensions?.forEach((ext) => acc[ext] = adapter);
return acc;
}, {});
if (Object.keys(_source_adapters).length) {
this._source_adapters = _source_adapters;
}
}
return this._source_adapters;
}
/**
* Retrieves the notices system from the environment.
* @readonly
* @returns {Object} The notices object.
*/
get notices() {
return this.env.smart_connections_plugin?.notices || this.env.main?.notices;
}
/**
* Retrieves the currently active note.
* @readonly
* @returns {SmartSource|null} The current SmartSource instance or null if none.
*/
get current_note() {
return this.get(this.env.smart_connections_plugin.app.workspace.getActiveFile().path);
}
/**
* Retrieves the file system instance, initializing it if necessary.
* @readonly
* @returns {SmartFS} The file system instance.
*/
get fs() {
if (!this._fs) {
this._fs = new this.env.opts.modules.smart_fs.class(this.env, {
adapter: this.env.opts.modules.smart_fs.adapter,
fs_path: this.env.opts.env_path || "",
exclude_patterns: this.excluded_patterns || []
});
}
return this._fs;
}
/**
* Retrieves the settings configuration by combining superclass settings and adapter-specific settings.
* @readonly
* @returns {Object} The settings configuration object.
*/
get settings_config() {
const _settings_config = {
...super.settings_config,
...this.process_settings_config(settings_config2),
...Object.entries(this.source_adapters).reduce((acc, [file_extension, adapter_constructor]) => {
if (acc[adapter_constructor])
return acc;
const item = this.items[Object.keys(this.items).find((i) => i.endsWith(file_extension))];
const adapter_instance = new adapter_constructor(item || new this.item_type(this.env, {}));
if (adapter_instance.settings_config) {
acc[adapter_constructor.name] = {
type: "html",
value: `<h4>${adapter_constructor.name} adapter</h4>`
};
acc = { ...acc, ...adapter_instance.settings_config };
}
return acc;
}, {})
};
return _settings_config;
}
/**
* Retrieves the block collection associated with SmartSources.
* @readonly
* @returns {SmartBlocks} The block collection instance.
*/
get block_collection() {
return this.env.smart_blocks;
}
/**
* Retrieves the embed queue containing items and their blocks to be embedded.
* @readonly
* @returns {Array<Object>} The embed queue.
*/
get embed_queue() {
if (!this._embed_queue.length) {
try {
const embed_blocks = this.block_collection.settings.embed_blocks;
this._embed_queue = Object.values(this.items).reduce((acc, item) => {
if (item._queue_embed || item.should_embed && item.is_unembedded)
acc.push(item);
if (embed_blocks)
item.blocks.forEach((block) => {
if (block._queue_embed || block.should_embed && block.is_unembedded)
acc.push(block);
});
return acc;
}, []);
} catch (e) {
console.error(`Error getting embed queue:`, e);
}
}
return this._embed_queue;
}
/**
* Clears all data by removing sources and blocks, reinitializing the file system, and reimporting items.
* @async
* @returns {Promise<void>}
*/
async run_clear_all() {
this.notices?.show("clearing_all");
await this.data_fs.remove_dir(this.data_dir, true);
this.clear();
this.block_collection.clear();
this._fs = null;
await this.fs.init();
await this.init_items();
this._excluded_headings = null;
Object.values(this.items).forEach((item) => {
item.queue_import();
item.queue_embed();
item.loaded_at = Date.now() + 9999999999;
});
this.notices?.remove("clearing_all");
this.notices?.show("done_clearing_all");
await this.process_source_import_queue();
}
/**
* Deletes all *.ajson files in the "multi/" data_dir, then re-saves all sources (opts.force=true).
*/
async run_clean_up_data() {
this.notices?.show("pruning_collection", { collection_key: this.block_collection.collection_key });
const remove_smart_blocks = this.block_collection.filter((item) => {
if (!item.vec)
return false;
if (item.is_gone) {
item.reason = "is_gone";
return true;
}
if (!item.should_embed) {
item.reason = "!should_embed";
return true;
}
return false;
});
for (let i = 0; i < remove_smart_blocks.length; i++) {
const item = remove_smart_blocks[i];
if (item.is_gone)
item.delete();
else
item.remove_embeddings();
}
this.notices?.remove("pruning_collection");
this.notices?.show("done_pruning_collection", { collection_key: this.block_collection.collection_key, count: remove_smart_blocks.length });
console.log(`Pruned ${remove_smart_blocks.length} blocks:
${remove_smart_blocks.map((item) => `${item.reason} - ${item.key}`).join("\n")}`);
await this.data_fs.remove_dir(this.data_dir, true);
await this.process_save_queue({ force: true });
}
/**
* Retrieves patterns for excluding files/folders from processing.
* @readonly
* @returns {Array<string>}
*/
get excluded_patterns() {
return [
...this.file_exclusions?.map((file) => `${file}**`) || [],
...(this.folder_exclusions || []).map((folder) => `${folder}**`),
this.env.env_data_dir + "/**"
];
}
/**
* Retrieves the file exclusion patterns from settings.
* @readonly
* @returns {Array<string>} An array of file exclusion patterns.
*/
get file_exclusions() {
return this.env.settings?.file_exclusions?.length ? this.env.settings.file_exclusions.split(",").map((file) => file.trim()) : [];
}
/**
* Retrieves the folder exclusion patterns from settings.
* @readonly
* @returns {Array<string>} An array of folder exclusion patterns.
*/
get folder_exclusions() {
return this.env.settings?.folder_exclusions?.length ? this.env.settings.folder_exclusions.split(",").map((folder) => {
folder = folder.trim();
if (folder === "")
return false;
if (folder === "/")
return false;
if (!folder.endsWith("/"))
return folder + "/";
return folder;
}).filter(Boolean) : [];
}
/**
* Retrieves the excluded headings from settings.
* @readonly
* @returns {Array<string>} An array of excluded headings.
*/
get excluded_headings() {
if (!this._excluded_headings) {
this._excluded_headings = this.env.settings?.excluded_headings?.length ? this.env.settings.excluded_headings.split(",").map((heading) => heading.trim()) : [];
}
return this._excluded_headings;
}
/**
* Retrieves the count of included files that are not excluded.
* @readonly
* @returns {number} The number of included files.
*/
get included_files() {
const extensions = Object.keys(this.source_adapters);
return this.fs.file_paths.filter((file_path) => extensions.some((ext) => file_path.endsWith(ext)) && !this.fs.is_excluded(file_path)).length;
}
get excluded_file_paths() {
return this.env.fs.file_paths.filter((file_path) => this.fs.is_excluded(file_path));
}
/**
* Retrieves the total number of files, regardless of exclusion.
* @readonly
* @returns {number} The total number of files.
*/
get total_files() {
return this.fs.file_paths.filter((file) => file.endsWith(".md") || file.endsWith(".canvas")).length;
}
get data_dir() {
return "multi";
}
};
var settings_config2 = {
};

var CollectionDataAdapter = class {
/**
* @constructor
* @param {Object} collection - The collection instance that this adapter manages.
*/
constructor(collection) {
this.collection = collection;
this.env = collection.env;
}
/**
* The class to use for item adapters.
* @type {typeof ItemDataAdapter}
*/
ItemDataAdapter = ItemDataAdapter;
/**
* Optional factory method to create item adapters.
* If `this.item_adapter_class` is not null, it uses that; otherwise can be overridden by subclasses.
* @param {Object} item - The item to create an adapter for.
* @returns {ItemDataAdapter}
*/
create_item_adapter(item) {
if (!this.ItemDataAdapter) {
throw new Error("No item_adapter_class specified and create_item_adapter not overridden.");
}
return new this.ItemDataAdapter(item);
}
/**
* Load a single item by its key using an `ItemDataAdapter`.
* @async
* @param {string} key - The key of the item to load.
* @returns {Promise<void>} Resolves when the item is loaded.
*/
async load_item(key) {
throw new Error("Not implemented");
}
/**
* Save a single item by its key using its associated `ItemDataAdapter`.
* @async
* @param {string} key - The key of the item to save.
* @returns {Promise<void>} Resolves when the item is saved.
*/
async save_item(key) {
throw new Error("Not implemented");
}
/**
* Delete a single item by its key. This may involve updating or removing its file,
* as handled by the `ItemDataAdapter`.
* @async
* @param {string} key - The key of the item to delete.
* @returns {Promise<void>} Resolves when the item is deleted.
*/
async delete_item(key) {
throw new Error("Not implemented");
}
/**
* Process any queued load operations. Typically orchestrates calling `load_item()`
* on items that have been flagged for loading.
* @async
* @returns {Promise<void>}
*/
async process_load_queue() {
throw new Error("Not implemented");
}
/**
* Process any queued save operations. Typically orchestrates calling `save_item()`
* on items that have been flagged for saving.
* @async
* @returns {Promise<void>}
*/
async process_save_queue() {
throw new Error("Not implemented");
}
/**
* Load the item's data from storage if it has been updated externally.
* @async
* @param {string} key - The key of the item to load.
* @returns {Promise<void>} Resolves when the item is loaded.
*/
async load_item_if_updated(item) {
const adapter = this.create_item_adapter(item);
await adapter.load_if_updated();
}
};
var ItemDataAdapter = class {
/**
* @constructor
* @param {Object} item - The collection item instance that this adapter manages.
*/
constructor(item) {
this.item = item;
}
/**
* Load the item's data from storage. May involve reading a file and parsing
* its contents, then updating `item.data`.
* @async
* @returns {Promise<void>} Resolves when the item is fully loaded.
*/
async load() {
throw new Error("Not implemented");
}
/**
* Save the item's data to storage. May involve writing to a file or appending
* lines in an append-only format.
* @async
* @param {string|null} [ajson=null] - An optional serialized representation of the item’s data.
*                                     If not provided, the adapter should derive it from the item.
* @returns {Promise<void>} Resolves when the item is saved.
*/
async save(ajson = null) {
throw new Error("Not implemented");
}
/**
* Delete the item's data from storage. May involve removing a file or writing
* a `null` entry in an append-only file to signify deletion.
* @async
* @returns {Promise<void>} Resolves when the item’s data is deleted.
*/
async delete() {
throw new Error("Not implemented");
}
/**
* Returns the file path or unique identifier used by this adapter to locate and store
* the item's data. This may be a file name derived from the item's key.
* @returns {string} The path or identifier for the item's data.
*/
get data_path() {
throw new Error("Not implemented");
}
/**
* @returns {CollectionDataAdapter} The collection data adapter that this item data adapter belongs to.
*/
get collection_adapter() {
return this.item.collection.data_adapter;
}
get env() {
return this.item.env;
}
/**
* Load the item's data from storage if it has been updated externally.
* @async
* @returns {Promise<void>} Resolves when the item is loaded.
*/
async load_if_updated() {
throw new Error("Not implemented");
}
};

var FileCollectionDataAdapter = class extends CollectionDataAdapter {
/**
* The class to use for item adapters.
* @type {typeof ItemDataAdapter}
*/
ItemDataAdapter = FileItemDataAdapter;
/**
* @returns {Object} Filesystem interface derived from environment or collection settings.
*/
get fs() {
return this.collection.data_fs || this.collection.env.data_fs;
}
};
var FileItemDataAdapter = class extends ItemDataAdapter {
/**
* @returns {Object} Filesystem interface derived from environment or collection settings.
*/
get fs() {
return this.item.collection.data_fs || this.item.collection.env.data_fs;
}
get data_path() {
throw new Error("Not implemented");
}
async load_if_updated() {
const data_path = this.data_path;
if (await this.fs.exists(data_path)) {
const loaded_at = this.item.loaded_at || 0;
const data_file_stat = await this.fs.stat(data_path);
if (data_file_stat.mtime > loaded_at + 1 * 60 * 1e3) {
console.log(`Smart Collections: Re-loading item ${this.item.key} because it has been updated on disk`);
await this.load();
}
}
}
};

var class_to_collection_key = {
"SmartSource": "smart_sources",
"SmartNote": "smart_sources",
"SmartBlock": "smart_blocks",
"SmartDirectory": "smart_directories"
};
var AjsonMultiFileCollectionDataAdapter = class extends FileCollectionDataAdapter {
/**
* The class to use for item adapters.
* @type {typeof ItemDataAdapter}
*/
ItemDataAdapter = AjsonMultiFileItemDataAdapter;
/**
* Load a single item by its key.
* @async
* @param {string} key
* @returns {Promise<void>}
*/
async load_item(key) {
const item = this.collection.get(key);
if (!item)
return;
const adapter = this.create_item_adapter(item);
await adapter.load();
}
/**
* Save a single item by its key.
* @async
* @param {string} key
* @returns {Promise<void>}
*/
async save_item(key) {
const item = this.collection.get(key);
if (!item)
return;
const adapter = this.create_item_adapter(item);
await adapter.save();
}
/**
* Process any queued load operations.
* @async
* @returns {Promise<void>}
*/
async process_load_queue() {
this.collection.show_process_notice("loading_collection");
if (!await this.fs.exists(this.collection.data_dir)) {
await this.fs.mkdir(this.collection.data_dir);
}
const load_queue = Object.values(this.collection.items).filter((item) => item._queue_load);
if (!load_queue.length) {
this.collection.clear_process_notice("loading_collection");
return;
}
console.log(`Loading ${this.collection.collection_key}: ${load_queue.length} items`);
const batch_size = 100;
for (let i = 0; i < load_queue.length; i += batch_size) {
const batch = load_queue.slice(i, i + batch_size);
await Promise.all(batch.map((item) => {
const adapter = this.create_item_adapter(item);
return adapter.load().catch((err) => {
console.warn(`Error loading item ${item.key}`, err);
item.queue_load();
});
}));
}
console.log(`Loaded ${this.collection.collection_key} in ${this.collection.load_time_ms}ms`);
this.collection.loaded = load_queue.length;
this.collection.clear_process_notice("loading_collection");
}
/**
* Process any queued save operations.
* @async
* @returns {Promise<void>}
*/
async process_save_queue() {
this.collection.show_process_notice("saving_collection");
const save_queue = Object.values(this.collection.items).filter((item) => item._queue_save);
console.log(`Saving ${this.collection.collection_key}: ${save_queue.length} items`);
const time_start = Date.now();
const batch_size = 50;
for (let i = 0; i < save_queue.length; i += batch_size) {
const batch = save_queue.slice(i, i + batch_size);
await Promise.all(batch.map((item) => {
const adapter = this.create_item_adapter(item);
return adapter.save().catch((err) => {
console.warn(`Error saving item ${item.key}`, err);
item.queue_save();
});
}));
}
const deleted_items = Object.values(this.collection.items).filter((item) => item.deleted);
if (deleted_items.length) {
deleted_items.forEach((item) => {
delete this.collection.items[item.key];
});
}
console.log(`Saved ${this.collection.collection_key} in ${Date.now() - time_start}ms`);
this.collection.clear_process_notice("saving_collection");
}
get_item_data_path(key) {
return [
this.collection.data_dir || "multi",
this.fs?.sep || "/",
this.get_data_file_name(key) + ".ajson"
].join("");
}
/**
* Transforms the item key into a safe filename.
* Replaces spaces, slashes, and dots with underscores.
* @returns {string} safe file name
*/
get_data_file_name(key) {
return key.split("#")[0].replace(/[\s\/\.]/g, "_").replace(".md", "");
}
/**
* Build a single AJSON line for the given item and data.
* @param {Object} item
* @returns {string}
*/
get_item_ajson(item) {
const collection_key = item.collection_key;
const key = item.key;
const data_value = item.deleted ? "null" : JSON.stringify(item.data);
return `${JSON.stringify(`${collection_key}:${key}`)}: ${data_value},`;
}
};
var AjsonMultiFileItemDataAdapter = class extends FileItemDataAdapter {
/**
* Derives the `.ajson` file path from the collection's data_dir and item key.
* @returns {string}
*/
get data_path() {
return this.collection_adapter.get_item_data_path(this.item.key);
}
/**
* Load the item from its `.ajson` file.
* @async
* @returns {Promise<void>}
*/
async load() {
try {
const raw_data = await this.fs.adapter.read(this.data_path, "utf-8", { no_cache: true });
if (!raw_data) {
this.item.queue_import();
return;
}
const { rewrite, file_data } = this._parse(raw_data);
if (rewrite) {
if (file_data.length)
await this.fs.write(this.data_path, file_data);
else
await this.fs.remove(this.data_path);
}
const last_import_mtime = this.item.data.last_import?.at || 0;
if (last_import_mtime && this.item.init_file_mtime > last_import_mtime) {
this.item.queue_import();
}
} catch (e) {
this.item.queue_import();
}
}
/**
* Parse the entire AJSON content as a JSON object, handle legacy keys, and extract final state.
* @private
* @param {string} ajson
* @returns {boolean}
*/
_parse(ajson) {
try {
let rewrite = false;
if (!ajson.length)
return false;
ajson = ajson.trim();
const original_line_count = ajson.split("\n").length;
const json_str = "{" + ajson.slice(0, -1) + "}";
const data = JSON.parse(json_str);
const entries = Object.entries(data);
for (let i = 0; i < entries.length; i++) {
const [ajson_key, value] = entries[i];
if (!value) {
delete data[ajson_key];
rewrite = true;
continue;
}
const { collection_key, item_key, changed } = this._parse_ajson_key(ajson_key);
if (changed) {
rewrite = true;
data[collection_key + ":" + item_key] = value;
delete data[ajson_key];
}
const collection = this.env[collection_key];
if (!collection)
continue;
const existing_item = collection.get(item_key);
if (!value.key)
value.key = item_key;
if (existing_item) {
existing_item.data = value;
existing_item._queue_load = false;
existing_item.loaded_at = Date.now();
} else {
const ItemClass = collection.item_type;
const new_item = new ItemClass(this.env, value);
new_item._queue_load = false;
new_item.loaded_at = Date.now();
collection.set(new_item);
}
}
if (rewrite || original_line_count > entries.length) {
rewrite = true;
}
return {
rewrite,
file_data: rewrite ? Object.entries(data).map(([key, value]) => `${JSON.stringify(key)}: ${JSON.stringify(value)},`).join("\n") : null
};
} catch (e) {
if (ajson.split("\n").some((line) => !line.endsWith(","))) {
console.warn("fixing trailing comma error");
ajson = ajson.split("\n").map((line) => line.endsWith(",") ? line : line + ",").join("\n");
return this._parse(ajson);
}
console.warn("Error parsing JSON:", e);
return { rewrite: true, file_data: null };
}
}
_parse_ajson_key(ajson_key) {
let changed;
let [collection_key, ...item_key] = ajson_key.split(":");
if (class_to_collection_key[collection_key]) {
collection_key = class_to_collection_key[collection_key];
changed = true;
}
return {
collection_key,
item_key: item_key.join(":"),
changed
};
}
/**
* Save the current state of the item by appending a new line to its `.ajson` file.
* @async
* @returns {Promise<void>}
*/
async save(retries = 0) {
try {
const ajson_line = this.get_item_ajson();
await this.fs.append(this.data_path, "\n" + ajson_line);
this.item._queue_save = false;
} catch (e) {
if (e.code === "ENOENT" && retries < 1) {
const dir = this.collection_adapter.collection.data_dir;
if (!await this.fs.exists(dir)) {
await this.fs.mkdir(dir);
}
return await this.save(retries + 1);
}
console.warn("Error saving item", this.data_path, e);
}
}
/**
* Build a single AJSON line for the given item and data.
* @param {Object} item
* @returns {string}
*/
get_item_ajson() {
return this.collection_adapter.get_item_ajson(this.item);
}
};

var AjsonMultiFileSourcesDataAdapter = class extends AjsonMultiFileCollectionDataAdapter {
ItemDataAdapter = AjsonMultiFileSourceDataAdapter;
};
var AjsonMultiFileSourceDataAdapter = class extends AjsonMultiFileItemDataAdapter {
};

var SourceContentAdapter = class {
constructor(item) {
this.item = item;
}
async import() {
this.throw_not_implemented("import");
}
async create() {
this.throw_not_implemented("create");
}
async update() {
this.throw_not_implemented("update");
}
async read() {
this.throw_not_implemented("read");
}
async remove() {
this.throw_not_implemented("remove");
}
get data() {
return this.item.data;
}
async create_hash(content) {
return await create_hash(content);
}
get settings() {
return this.item.env.settings.smart_sources[this.adapter_key];
}
get adapter_key() {
return to_snake(this.constructor.name);
}
static get adapter_key() {
return to_snake(this.name);
}
get fs() {
return this.item.collection.fs;
}
get env() {
return this.item.env;
}
};
function to_snake(str) {
return str[0].toLowerCase() + str.slice(1).replace(/([A-Z])/g, "_$1").toLowerCase();
}

function parse_markdown_blocks(markdown, opts = {}) {
const { start_index = 1, line_keys = false } = opts;
const lines = markdown.split("\n");
const result = {};
const heading_stack = [];
const heading_lines = {};
const heading_counts = {};
const sub_block_counts = {};
const subheading_counts = {};
let current_list_item = null;
let current_content_block = null;
let in_frontmatter = false;
let frontmatter_started = false;
const root_heading_key = "#";
let in_code_block = false;
sub_block_counts[root_heading_key] = 0;
for (let i = 0; i < lines.length; i++) {
const line_number = i + start_index;
const line = lines[i];
const trimmed_line = line.trim();
if (trimmed_line === "---") {
if (!frontmatter_started) {
frontmatter_started = true;
in_frontmatter = true;
heading_lines["#---frontmatter---"] = [line_number, null];
continue;
} else if (in_frontmatter) {
in_frontmatter = false;
heading_lines["#---frontmatter---"][1] = line_number;
continue;
}
}
if (in_frontmatter) {
continue;
}
if (trimmed_line.startsWith("```")) {
in_code_block = !in_code_block;
if (!current_content_block) {
const parent_key = heading_stack.length > 0 ? heading_stack[heading_stack.length - 1].key : root_heading_key;
if (parent_key === root_heading_key && !heading_lines[root_heading_key]) {
heading_lines[root_heading_key] = [line_number, null];
}
if (parent_key === root_heading_key) {
current_content_block = { key: root_heading_key, start_line: line_number };
if (heading_lines[root_heading_key][1] === null || heading_lines[root_heading_key][1] < line_number) {
heading_lines[root_heading_key][1] = null;
}
} else {
if (sub_block_counts[parent_key] === void 0) {
sub_block_counts[parent_key] = 0;
}
sub_block_counts[parent_key] += 1;
const n = sub_block_counts[parent_key];
const key = `${parent_key}#{${n}}`;
heading_lines[key] = [line_number, null];
current_content_block = { key, start_line: line_number };
}
}
continue;
}
const heading_match = trimmed_line.match(/^(#{1,6})\s*(.+)$/);
if (heading_match && !in_code_block) {
const level = heading_match[1].length;
let title = heading_match[2].trim();
while (heading_stack.length > 0 && heading_stack[heading_stack.length - 1].level >= level) {
const finished_heading = heading_stack.pop();
if (heading_lines[finished_heading.key][1] === null) {
heading_lines[finished_heading.key][1] = line_number - 1;
}
}
if (heading_stack.length === 0 && heading_lines[root_heading_key] && heading_lines[root_heading_key][1] === null) {
heading_lines[root_heading_key][1] = line_number - 1;
}
if (current_content_block) {
if (heading_lines[current_content_block.key][1] === null) {
heading_lines[current_content_block.key][1] = line_number - 1;
}
current_content_block = null;
}
if (current_list_item) {
if (heading_lines[current_list_item.key][1] === null) {
heading_lines[current_list_item.key][1] = line_number - 1;
}
current_list_item = null;
}
let parent_key = "";
let parent_level = 0;
if (heading_stack.length > 0) {
parent_key = heading_stack[heading_stack.length - 1].key;
parent_level = heading_stack[heading_stack.length - 1].level;
} else {
parent_key = "";
parent_level = 0;
}
if (heading_stack.length === 0) {
heading_counts[title] = (heading_counts[title] || 0) + 1;
if (heading_counts[title] > 1) {
title += `[${heading_counts[title]}]`;
}
} else {
if (!subheading_counts[parent_key]) {
subheading_counts[parent_key] = {};
}
subheading_counts[parent_key][title] = (subheading_counts[parent_key][title] || 0) + 1;
const count = subheading_counts[parent_key][title];
if (count > 1) {
title += `#{${count}}`;
}
}
const level_diff = level - parent_level;
const hashes = "#".repeat(level_diff);
const key = parent_key + hashes + title;
heading_lines[key] = [line_number, null];
sub_block_counts[key] = 0;
heading_stack.push({ level, title, key });
continue;
}
const list_match = line.match(/^(\s*)([-*]|\d+\.) (.+)$/);
if (list_match && !in_code_block) {
const indentation = list_match[1].length;
if (indentation === 0) {
if (current_list_item) {
if (heading_lines[current_list_item.key][1] === null) {
heading_lines[current_list_item.key][1] = line_number - 1;
}
current_list_item = null;
}
if (current_content_block && current_content_block.key !== root_heading_key) {
if (heading_lines[current_content_block.key][1] === null) {
heading_lines[current_content_block.key][1] = line_number - 1;
}
current_content_block = null;
}
let parent_key = heading_stack.length > 0 ? heading_stack[heading_stack.length - 1].key : root_heading_key;
if (parent_key === root_heading_key && !heading_lines[root_heading_key]) {
heading_lines[root_heading_key] = [line_number, null];
}
if (sub_block_counts[parent_key] === void 0) {
sub_block_counts[parent_key] = 0;
}
sub_block_counts[parent_key] += 1;
const n = sub_block_counts[parent_key];
let key;
if (line_keys) {
const words = get_longest_words_in_order(list_match[3], 10);
key = `${parent_key}#${words}`;
} else {
key = `${parent_key}#{${n}}`;
}
heading_lines[key] = [line_number, null];
current_list_item = { key, start_line: line_number };
continue;
}
if (current_list_item) {
continue;
}
}
if (trimmed_line === "") {
continue;
}
if (!current_content_block) {
if (current_list_item) {
if (heading_lines[current_list_item.key][1] === null) {
heading_lines[current_list_item.key][1] = line_number - 1;
}
current_list_item = null;
}
let parent_key = heading_stack.length > 0 ? heading_stack[heading_stack.length - 1].key : root_heading_key;
if (parent_key === root_heading_key) {
if (!heading_lines[root_heading_key]) {
heading_lines[root_heading_key] = [line_number, null];
}
if (heading_lines[root_heading_key][1] === null || heading_lines[root_heading_key][1] < line_number) {
heading_lines[root_heading_key][1] = null;
}
current_content_block = { key: root_heading_key, start_line: line_number };
} else {
if (sub_block_counts[parent_key] === void 0) {
sub_block_counts[parent_key] = 0;
}
sub_block_counts[parent_key] += 1;
const n = sub_block_counts[parent_key];
const key = `${parent_key}#{${n}}`;
heading_lines[key] = [line_number, null];
current_content_block = { key, start_line: line_number };
}
}
}
const total_lines = lines.length;
while (heading_stack.length > 0) {
const finished_heading = heading_stack.pop();
if (heading_lines[finished_heading.key][1] === null) {
heading_lines[finished_heading.key][1] = total_lines + start_index - 1;
}
}
if (current_list_item) {
if (heading_lines[current_list_item.key][1] === null) {
heading_lines[current_list_item.key][1] = total_lines + start_index - 1;
}
current_list_item = null;
}
if (current_content_block) {
if (heading_lines[current_content_block.key][1] === null) {
heading_lines[current_content_block.key][1] = total_lines + start_index - 1;
}
current_content_block = null;
}
if (heading_lines[root_heading_key] && heading_lines[root_heading_key][1] === null) {
heading_lines[root_heading_key][1] = total_lines + start_index - 1;
}
for (const key in heading_lines) {
result[key] = heading_lines[key];
}
return result;
}
function get_longest_words_in_order(line, n = 3) {
const words = line.split(/\s+/).sort((a, b) => b.length - a.length).slice(0, n);
return words.sort((a, b) => line.indexOf(a) - line.indexOf(b)).join(" ");
}

var FileSourceContentAdapter = class extends SourceContentAdapter {
static async init_items(collection) {
if (collection.fs_items_initialized)
return;
collection._fs = null;
await collection.fs.init();
for (const file of Object.values(collection.fs.files)) {
const item = collection.init_file_path(file.path);
if (item)
item.init_file_mtime = file.stat.mtime;
}
collection.fs_items_initialized = Date.now();
}
/**
* @name fs
* @type {Object}
* @readonly
* @description
* Access the file system interface used by this adapter. Typically derived
* from `this.item.collection.fs`.
*/
get fs() {
return this.item.collection.fs;
}
/**
* @name file_path
* @type {string}
* @readonly
* @description
* The file path on disk corresponding to the source. Used for read/write operations.
*/
get file_path() {
return this.item.file_path;
}
/**
* @async
* @method create
* @param {string|null} [content=null] Initial content for the new file.
* @description
* Create a new file on disk. If content is not provided, attempts to use
* `this.item.data.content` as fallback.
*/
async create(content = null) {
if (!content)
content = this.item.data.content || "";
await this.fs.write(this.file_path, content);
}
/**
* @async
* @method update
* @param {string} content The full new content to write to the file.
* @description
* Overwrite the entire file content on disk.
*/
async update(content) {
await this.fs.write(this.file_path, content);
}
/**
* @async
* @method read
* @returns {Promise<string>} The content of the file.
* @description
* Read the file content from disk. Updates `last_read` hash and timestamp on the entity’s data.
* If file is large or special handling is needed, override this method.
*/
async read() {
const content = await this.fs.read(this.file_path);
this.data.last_read = {
hash: await this.create_hash(content || ""),
at: Date.now()
};
return content;
}
/**
* @async
* @method remove
* @returns {Promise<void>}
* @description
* Delete the file from disk. After removal, the source item should also be deleted or updated accordingly.
*/
async remove() {
await this.fs.remove(this.file_path);
}
async move_to(move_to_ref) {
if (!move_to_ref) {
throw new Error("Invalid entity reference for move_to operation");
}
const move_content = await this.read();
let has_existing = false;
if (typeof move_to_ref === "string") {
const existing = this.item.collection.get(move_to_ref);
if (existing) {
move_to_ref = existing;
has_existing = true;
}
} else {
has_existing = true;
}
if (has_existing) {
await move_to_ref.append(move_content);
} else {
move_to_ref = await this.item.collection.create(move_to_ref, move_content);
}
if (this.item.key !== move_to_ref.key) {
await this.remove();
this.item.delete();
} else {
console.log(`did not delete ${this.item.key} because it was moved to ${move_to_ref.key}`);
}
return move_to_ref;
}
/**
* TRANSFERRED FROM markdown.js (2024-12-13)
* TODO NEEDS REVIEW/REFACTOR
*/
async move_to_v1(entity_ref) {
const new_path = typeof entity_ref === "string" ? entity_ref : entity_ref.key;
if (!new_path) {
throw new Error("Invalid entity reference for move_to operation");
}
const current_content = await this.read();
const [target_source_key, ...headings] = new_path.split("#");
const target_source = this.item.collection.get(target_source_key);
if (headings.length > 0) {
const new_headings_content = this.construct_headings(headings);
const new_content = `${new_headings_content}
${current_content}`;
await this._update(new_content);
}
if (target_source) {
await this.merge(current_content, { mode: "append_blocks" });
} else {
await this.rename_and_import(target_source_key, current_content);
}
if (this.item.key !== target_source_key)
await this.remove();
}
construct_headings(headings) {
return headings.map((heading, i) => `${"#".repeat(i + 1)} ${heading}`).join("\n");
}
async rename_and_import(target_source_key, content) {
await this.fs.rename(this.file_path, target_source_key);
const new_source = await this.item.collection.create_or_update({ path: target_source_key, content });
await new_source.import();
}
/**
* Merge content into the source
* @param {string} content - The content to merge into the source
* @param {Object} opts - Options for the merge operation
* @param {string} opts.mode - The mode to use for the merge operation. Defaults to 'append_blocks' (may also be 'replace_blocks')
*/
async merge(content, opts = {}) {
const { mode = "append_blocks" } = opts;
const blocks_obj = parse_markdown_blocks(content);
if (typeof blocks_obj !== "object" || Array.isArray(blocks_obj)) {
console.warn("merge error: Expected an object from parse_markdown_blocks, but received:", blocks_obj);
throw new Error("merge error: parse_markdown_blocks did not return an object as expected.");
}
const { new_blocks, new_with_parent_blocks, changed_blocks, same_blocks } = await this.get_changes(blocks_obj, content);
for (const block of new_blocks) {
await this.append(block.content);
}
for (const block of new_with_parent_blocks) {
const parent_block = this.item.block_collection.get(block.parent_key);
await parent_block.append(block.content);
}
for (const block of changed_blocks) {
const changed_block = this.item.block_collection.get(block.key);
if (mode === "replace_blocks") {
await changed_block.update(block.content);
} else {
await changed_block.append(block.content);
}
}
}
async get_changes(blocks_obj, content) {
const new_blocks = [];
const new_with_parent_blocks = [];
const changed_blocks = [];
const same_blocks = [];
const existing_blocks = this.source.data.blocks || {};
for (const [sub_key, line_range] of Object.entries(blocks_obj)) {
const has_existing = !!existing_blocks[sub_key];
const block_key = `${this.source.key}${sub_key}`;
const block_content = get_line_range(content, line_range[0], line_range[1]);
if (!has_existing) {
new_blocks.push({
key: block_key,
state: "new",
content: block_content
});
continue;
}
let has_parent;
let headings = sub_key.split("#");
let parent_key;
while (!has_parent && headings.length > 0) {
headings.pop();
parent_key = headings.join("#");
has_parent = !!existing_blocks[parent_key];
}
if (has_parent) {
new_with_parent_blocks.push({
key: block_key,
parent_key: `${this.source.key}${parent_key}`,
state: "new",
content: block_content
});
continue;
}
const block = this.item.block_collection.get(block_key);
const content_hash = await this.create_hash(block_content);
if (content_hash !== block.last_read?.hash) {
changed_blocks.push({
key: block_key,
state: "changed",
content: block_content
});
continue;
}
same_blocks.push({
key: block_key,
state: "same",
content: block_content
});
}
return {
new_blocks,
new_with_parent_blocks,
changed_blocks,
same_blocks
};
}
/**
* Append new content to the source file, placing it at the end of the file.
* @async
* @param {string} content - The content to append.
* @returns {Promise<void>}
*/
async append(content) {
const current_content = await this.read();
const new_content = [
current_content,
"",
content
].join("\n").trim();
await this.update(new_content);
}
};

function get_markdown_links(content) {
const markdown_link_pattern = /\[([^\]]+)\]\(([^)]+)\)/g;
const wikilink_pattern = /\[\[([^\|\]]+)(?:\|([^\]]+))?\]\]/g;
const result = [];
const extract_links_from_pattern = (pattern, type) => {
let match;
while ((match = pattern.exec(content)) !== null) {
const title = type === "markdown" ? match[1] : match[2] || match[1];
const target = type === "markdown" ? match[2] : match[1];
const line = content.substring(0, match.index).split("\n").length;
result.push({ title, target, line });
}
};
extract_links_from_pattern(markdown_link_pattern, "markdown");
extract_links_from_pattern(wikilink_pattern, "wikilink");
result.sort((a, b) => a.line - b.line || a.target.localeCompare(b.target));
return result;
}

async function parse_links(source, content) {
if (!source.source_adapter?.get_links)
return;
const outlinks = await source.source_adapter.get_links(content);
source.data.outlinks = outlinks;
}

async function parse_metadata(source, content) {
if (!source.source_adapter?.get_metadata)
return;
const metadata = await source.source_adapter?.get_metadata?.(content);
source.data.metadata = metadata;
}

function parse_value(raw_value) {
const trimmed = raw_value.trim();
if (trimmed.startsWith('"') && trimmed.endsWith('"') || trimmed.startsWith("'") && trimmed.endsWith("'")) {
return trimmed.slice(1, -1);
}
const lower = trimmed.toLowerCase();
if (lower === "true")
return true;
if (lower === "false")
return false;
if (!isNaN(trimmed) && trimmed !== "") {
return Number(trimmed);
}
return trimmed;
}
function parse_yaml_block(yaml_block) {
const lines = yaml_block.split(/\r?\n/);
const data = {};
let i = 0;
while (i < lines.length) {
const line = lines[i];
i++;
if (!line.trim() || line.trim().startsWith("#")) {
continue;
}
const match = line.match(/^([^:]+)\s*:\s*(.*)$/);
if (!match) {
continue;
}
const key = match[1].trim();
let value = match[2].trim();
if (value === ">" || value === "|") {
const multiline_lines = [];
while (i < lines.length) {
const next_line = lines[i];
if (!/^\s+/.test(next_line) || next_line.trim().startsWith("#")) {
break;
}
multiline_lines.push(next_line.replace(/^\s+/, ""));
i++;
}
const joined = multiline_lines.join("\n");
data[key] = parse_value(joined);
} else if (value === "") {
const arr = [];
let array_consumed = false;
while (i < lines.length) {
const next_line = lines[i];
if (!next_line.trim().startsWith("- ")) {
break;
}
const item_value = next_line.trim().slice(2);
arr.push(parse_value(item_value));
i++;
array_consumed = true;
}
if (array_consumed) {
data[key] = arr;
} else {
data[key] = "";
}
} else {
data[key] = parse_value(value);
}
}
return data;
}
function parse_frontmatter(content) {
if (!content.startsWith("---")) {
return { frontmatter: {}, body: content };
}
const lines = content.split(/\r?\n/);
let end_index = -1;
for (let i = 1; i < lines.length; i++) {
if (lines[i].trim() === "---") {
end_index = i;
break;
}
}
if (end_index === -1) {
return { frontmatter: {}, body: content };
}
const frontmatter_lines = lines.slice(1, end_index);
const frontmatter_block = frontmatter_lines.join("\n");
const frontmatter = parse_yaml_block(frontmatter_block);
const body_lines = lines.slice(end_index + 1);
const body = body_lines.join("\n");
return { frontmatter, body };
}

var MarkdownSourceContentAdapter = class extends FileSourceContentAdapter {
static extensions = ["md", "txt"];
/**
* Import the source file content, parse blocks and links, and update `item.data`.
* @async
* @returns {Promise<void>}
*/
async import() {
if (!this.can_import)
return;
if (!this.outdated) {
this.item.blocks.forEach((block) => {
if (!block.vec)
block.queue_embed();
});
return;
}
const content = await this.read();
if (!content) {
return;
}
if (!this.item.vec) {
this.item.data.last_import = null;
}
if (this.data.last_import?.hash === this.data.last_read?.hash) {
if (this.data.blocks)
return;
}
this.data.blocks = null;
await this.parse_content(content);
await this.item.parse_content(content);
const { mtime, size } = this.item.file.stat;
this.data.last_import = {
mtime,
size,
at: Date.now(),
hash: this.data.last_read.hash
};
this.item.loaded_at = Date.now();
this.item.queue_save();
this.item.queue_embed();
}
async parse_content(content) {
await parse_links(this.item, content);
await parse_metadata(this.item, content);
}
async get_links(content = null) {
if (!content)
content = await this.read();
if (!content)
return;
return get_markdown_links(content);
}
async get_metadata(content = null) {
if (!content)
content = await this.read();
if (!content)
return;
const { frontmatter } = parse_frontmatter(content);
return frontmatter;
}
get can_import() {
if (!this.item.file) {
console.warn(`MarkdownSourceContentAdapter: Skipping missing-file: ${this.file_path}`);
return false;
}
if (this.item.file_type !== "md") {
return false;
}
if (this.item.size > 1e6) {
return false;
}
return true;
}
/**
* @deprecated use outdated instead
*/
get should_import() {
return this.outdated;
}
get outdated() {
try {
if (!this.data.last_import) {
if (this.data.mtime && this.data.size && this.data.hash) {
this.data.last_import = {
mtime: this.data.mtime,
size: this.data.size,
at: Date.now(),
hash: this.data.hash
};
delete this.data.mtime;
delete this.data.size;
delete this.data.hash;
} else {
return true;
}
}
if (this.data.last_read.at > this.data.last_import.at) {
if (this.data.last_import?.hash !== this.data.last_read?.hash)
return true;
}
if (this.data.last_import.mtime < this.item.mtime) {
if (!this.data.last_import.size)
return true;
const size_diff = Math.abs(this.data.last_import.size - this.item.size);
const size_diff_ratio = size_diff / (this.data.last_import.size || 1);
if (size_diff_ratio > 0.01)
return true;
}
return false;
} catch (e) {
console.warn(`MarkdownSourceContentAdapter: error getting should_import for ${this.file_path}: ${e}`);
return true;
}
}
};

var import_obsidian2 = require("obsidian");
var ObsidianMarkdownSourceContentAdapter = class extends MarkdownSourceContentAdapter {
/**
* Returns the frontmatter metadata from Obsidian's metadataCache.
* @async
* @returns {Promise<Object>} Frontmatter data if available, otherwise undefined.
*/
async get_metadata() {
const app = this.item.env.main.app;
const { frontmatter } = app.metadataCache.getFileCache(this.item.file) || {};
return frontmatter;
}
/**
* Reads the file content. If opts.render_output is true, attempts to use
* Obsidian's MarkdownRenderer to render the file to HTML, then convert it
* back to markdown via htmlToMarkdown.
* @async
* @param {Object} [opts={}] - Options for reading.
* @param {boolean} [opts.render_output=false] - If true, render MD -> HTML -> MD.
* @returns {Promise<string>} The file content (possibly rendered).
*/
async read(opts = {}) {
const content = await super.read(opts);
if (!opts.render_output) {
return content;
}
const app = this.item.env.main.app;
if (!app || !import_obsidian2.MarkdownRenderer || !import_obsidian2.htmlToMarkdown) {
console.warn("Obsidian environment not found; cannot render markdown.");
return content;
}
const container = document.createElement("div");
await import_obsidian2.MarkdownRenderer.render(app, content, container, this.item.path, new import_obsidian2.Component());
let last_html = container.innerHTML;
const max_wait = 1e4;
let wait_time = 0;
let conseq_same = 0;
let changed = true;
while (conseq_same < 7) {
await new Promise((resolve) => setTimeout(resolve, 100));
changed = last_html !== container.innerHTML;
last_html = container.innerHTML;
if (!changed)
conseq_same++;
else
conseq_same = 0;
wait_time += 100;
if (wait_time > max_wait) {
console.warn("ObsidianMarkdownSourceContentAdapter: Timeout waiting for markdown to render.");
break;
}
}
const newMd = (0, import_obsidian2.htmlToMarkdown)(container);
return newMd;
}
};

function collection_instance_name_from2(class_name) {
if (class_name.endsWith("Item")) {
return class_name.replace(/Item$/, "").toLowerCase();
}
return class_name.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase().replace(/y$/, "ie") + "s";
}

function create_uid2(data) {
const str = JSON.stringify(data);
let hash = 0;
if (str.length === 0)
return hash;
for (let i = 0; i < str.length; i++) {
const char = str.charCodeAt(i);
hash = (hash << 5) - hash + char;
hash = hash & hash;
if (hash < 0)
hash = hash * -1;
}
return hash.toString() + str.length;
}
function deep_merge3(target, source) {
for (const key in source) {
if (source.hasOwnProperty(key)) {
if (is_obj(source[key]) && is_obj(target[key]))
deep_merge3(target[key], source[key]);
else
target[key] = source[key];
}
}
return target;
function is_obj(item) {
return item && typeof item === "object" && !Array.isArray(item);
}
}

function deep_equal2(obj1, obj2, visited = /* @__PURE__ */ new WeakMap()) {
if (obj1 === obj2)
return true;
if (obj1 === null || obj2 === null || obj1 === void 0 || obj2 === void 0)
return false;
if (typeof obj1 !== typeof obj2 || Array.isArray(obj1) !== Array.isArray(obj2))
return false;
if (Array.isArray(obj1)) {
if (obj1.length !== obj2.length)
return false;
return obj1.every((item, index) => deep_equal2(item, obj2[index], visited));
}
if (typeof obj1 === "object") {
if (visited.has(obj1))
return visited.get(obj1) === obj2;
visited.set(obj1, obj2);
const keys1 = Object.keys(obj1);
const keys2 = Object.keys(obj2);
if (keys1.length !== keys2.length)
return false;
return keys1.every((key) => deep_equal2(obj1[key], obj2[key], visited));
}
return obj1 === obj2;
}

var CollectionItem2 = class _CollectionItem {
/**
* Default properties for an instance of CollectionItem.
* Override in subclasses to define different defaults.
* @returns {Object}
*/
static get defaults() {
return {
data: {}
};
}
/**
* @param {Object} env - The environment/context.
* @param {Object|null} [data=null] - Initial data for the item.
*/
constructor(env, data = null) {
env.create_env_getter(this);
this.config = this.env?.config;
this.merge_defaults();
if (data)
deep_merge3(this.data, data);
if (!this.data.class_name)
this.data.class_name = this.constructor.name;
}
/**
* Loads an item from data and initializes it.
* @param {Object} env
* @param {Object} data
* @returns {CollectionItem}
*/
static load(env, data) {
const item = new this(env, data);
item.init();
return item;
}
/**
* Merge default properties from the entire inheritance chain.
* @private
*/
merge_defaults() {
let current_class = this.constructor;
while (current_class) {
for (let key in current_class.defaults) {
const default_val = current_class.defaults[key];
if (typeof default_val === "object") {
this[key] = { ...default_val, ...this[key] };
} else {
this[key] = this[key] === void 0 ? default_val : this[key];
}
}
current_class = Object.getPrototypeOf(current_class);
}
}
/**
* Generates or retrieves a unique key for the item.
* Key syntax supports:
* - `[i]` for sequences
* - `/` for super-sources (groups, directories, clusters)
* - `#` for sub-sources (blocks)
* @returns {string} The unique key
*/
get_key() {
return create_uid2(this.data);
}
/**
* Updates the item data and returns true if changed.
* @param {Object} data
* @returns {boolean} True if data changed.
*/
update_data(data) {
const sanitized_data = this.sanitize_data(data);
const current_data = { ...this.data };
deep_merge3(current_data, sanitized_data);
const changed = !deep_equal2(this.data, current_data);
if (!changed)
return false;
this.data = current_data;
return true;
}
/**
* Sanitizes data for saving. Ensures no circular references.
* @param {*} data
* @returns {*} Sanitized data.
*/
sanitize_data(data) {
if (data instanceof _CollectionItem)
return data.ref;
if (Array.isArray(data))
return data.map((val) => this.sanitize_data(val));
if (typeof data === "object" && data !== null) {
return Object.keys(data).reduce((acc, key) => {
acc[key] = this.sanitize_data(data[key]);
return acc;
}, {});
}
return data;
}
/**
* Initializes the item. Override as needed.
* @param {Object} [input_data] - Additional data that might be provided on creation.
*/
init(input_data) {
}
/**
* Queues this item for saving.
*/
queue_save() {
this._queue_save = true;
}
/**
* Saves this item using its data adapter.
* @returns {Promise<void>}
*/
async save() {
try {
await this.data_adapter.save_item(this);
this.init();
} catch (err) {
this._queue_save = true;
console.error(err, err.stack);
}
}
/**
* Queues this item for loading.
*/
queue_load() {
this._queue_load = true;
}
/**
* Loads this item using its data adapter.
* @returns {Promise<void>}
*/
async load() {
try {
await this.data_adapter.load_item(this);
this.init();
} catch (err) {
this._load_error = err;
this.on_load_error(err);
}
}
/**
* Handles load errors by re-queuing for load.
* Override if needed.
* @param {Error} err
*/
on_load_error(err) {
this.queue_load();
}
/**
* Validates the item before saving. Checks for presence and validity of key.
* @returns {boolean}
*/
validate_save() {
if (!this.key)
return false;
if (this.key.trim() === "")
return false;
if (this.key === "undefined")
return false;
return true;
}
/**
* Marks this item as deleted. This does not immediately remove it from memory,
* but queues a save that will result in the item being removed from persistent storage.
*/
delete() {
this.deleted = true;
this.queue_save();
}
/**
* Filters items in the collection based on provided options.
* functional filter (returns true or false) for filtering items in collection; called by collection class
* @param {Object} filter_opts - Filtering options.
* @param {string} [filter_opts.exclude_key] - A single key to exclude.
* @param {string[]} [filter_opts.exclude_keys] - An array of keys to exclude. If exclude_key is provided, it's added to this array.
* @param {string} [filter_opts.exclude_key_starts_with] - Exclude keys starting with this string.
* @param {string[]} [filter_opts.exclude_key_starts_with_any] - Exclude keys starting with any of these strings.
* @param {string} [filter_opts.exclude_key_includes] - Exclude keys that include this string.
* @param {string} [filter_opts.key_ends_with] - Include only keys ending with this string.
* @param {string} [filter_opts.key_starts_with] - Include only keys starting with this string.
* @param {string[]} [filter_opts.key_starts_with_any] - Include only keys starting with any of these strings.
* @param {string} [filter_opts.key_includes] - Include only keys that include this string.
* @returns {boolean} True if the item passes the filter, false otherwise.
*/
filter(filter_opts = {}) {
const {
exclude_key,
exclude_keys = exclude_key ? [exclude_key] : [],
exclude_key_starts_with,
exclude_key_starts_with_any,
exclude_key_includes,
exclude_key_includes_any,
key_ends_with,
key_starts_with,
key_starts_with_any,
key_includes,
key_includes_any
} = filter_opts;
if (exclude_keys?.includes(this.key))
return false;
if (exclude_key_starts_with && this.key.startsWith(exclude_key_starts_with))
return false;
if (exclude_key_starts_with_any && exclude_key_starts_with_any.some((prefix) => this.key.startsWith(prefix)))
return false;
if (exclude_key_includes && this.key.includes(exclude_key_includes))
return false;
if (exclude_key_includes_any && exclude_key_includes_any.some((include) => this.key.includes(include)))
return false;
if (key_ends_with && !this.key.endsWith(key_ends_with))
return false;
if (key_starts_with && !this.key.startsWith(key_starts_with))
return false;
if (key_starts_with_any && !key_starts_with_any.some((prefix) => this.key.startsWith(prefix)))
return false;
if (key_includes && !this.key.includes(key_includes))
return false;
if (key_includes_any && !key_includes_any.some((include) => this.key.includes(include)))
return false;
return true;
}
/**
* Parses item data for additional processing. Override as needed.
*/
parse() {
}
/**
* Helper function to render a component in the item scope
* @param {*} component_key
* @param {*} opts
* @returns
*/
async render_component(component_key, opts = {}) {
return await this.env.render_component(component_key, this, opts);
}
get actions() {
if (!this._actions) {
this._actions = Object.entries(this.env.opts.items[this.item_type_key].actions || {}).reduce((acc, [k, v]) => {
acc[k] = v.bind(this);
return acc;
}, {});
}
return this._actions;
}
/**
* Derives the collection key from the class name.
* @returns {string}
*/
static get collection_key() {
let name = this.name;
if (name.match(/\d$/))
name = name.slice(0, -1);
return collection_instance_name_from2(name);
}
/**
* @returns {string} The collection key for this item.
*/
get collection_key() {
let name = this.constructor.name;
if (name.match(/\d$/))
name = name.slice(0, -1);
return collection_instance_name_from2(name);
}
/**
* Retrieves the parent collection from the environment.
* @returns {Collection}
*/
get collection() {
return this.env[this.collection_key];
}
/**
* @returns {string} The item's key.
*/
get key() {
return this.data?.key || this.get_key();
}
get item_type_key() {
let name = this.constructor.name;
if (name.match(/\d$/))
name = name.slice(0, -1);
return camel_case_to_snake_case3(name);
}
/**
* A simple reference object for this item.
* @returns {{collection_key: string, key: string}}
*/
get ref() {
return { collection_key: this.collection_key, key: this.key };
}
/**
* @returns {Object} The data adapter for this item's collection.
*/
get data_adapter() {
return this.collection.data_adapter;
}
/**
* @returns {Object} The filesystem adapter.
*/
get data_fs() {
return this.collection.data_fs;
}
/**
* Access to collection-level settings.
* @returns {Object}
*/
get settings() {
if (!this.env.settings[this.collection_key])
this.env.settings[this.collection_key] = {};
return this.env.settings[this.collection_key];
}
set settings(settings) {
this.env.settings[this.collection_key] = settings;
this.env.smart_settings.save();
}
/**
* Render this item into a container using the item's component.
* @deprecated 2024-12-02 Use explicit component pattern from environment
* @param {HTMLElement} container
* @param {Object} opts
* @returns {Promise<HTMLElement>}
*/
async render_item(container, opts = {}) {
const frag = await this.component.call(this.smart_view, this, opts);
container.innerHTML = "";
container.appendChild(frag);
return container;
}
/**
* @deprecated use env.smart_view
* @returns {Object}
*/
get smart_view() {
if (!this._smart_view)
this._smart_view = this.env.init_module("smart_view");
return this._smart_view;
}
/**
* Override in child classes to set the component for this item
* @deprecated 2024-12-02
* @returns {Function} The render function for this component
*/
get component() {
return item_component;
}
};
function camel_case_to_snake_case3(str) {
const result = str.replace(/([A-Z])/g, (match) => `_${match.toLowerCase()}`).replace(/^_/, "").replace(/2$/, "");
return result;
}

var AsyncFunction2 = Object.getPrototypeOf(async function() {
}).constructor;
var Collection2 = class {
/**
* Constructs a new Collection instance.
*
* @param {Object} env - The environment context containing configurations and adapters.
* @param {Object} [opts={}] - Optional configuration.
* @param {string} [opts.collection_key] - Custom key to override default collection name.
* @param {string} [opts.data_dir] - Custom data directory path.
* @param {boolean} [opts.prevent_load_on_init] - Whether to prevent loading items on initialization.
*/
constructor(env, opts = {}) {
env.create_env_getter(this);
this.opts = opts;
if (opts.collection_key)
this.collection_key = opts.collection_key;
this.env[this.collection_key] = this;
this.config = this.env.config;
this.items = {};
this.loaded = null;
this._loading = false;
this.load_time_ms = null;
this.settings_container = null;
}
/**
* Initializes a new collection in the environment. Override in subclass if needed.
*
* @param {Object} env
* @param {Object} [opts={}]
* @returns {Promise<void>}
*/
static async init(env, opts = {}) {
env[this.collection_key] = new this(env, opts);
await env[this.collection_key].init();
env.collections[this.collection_key] = "init";
}
/**
* The unique collection key derived from the class name.
* @returns {string}
*/
static get collection_key() {
let name = this.name;
if (name.match(/\d$/))
name = name.slice(0, -1);
return name.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
}
/**
* Instance-level init. Override in subclasses if necessary.
* @returns {Promise<void>}
*/
async init() {
}
/**
* Creates or updates an item in the collection.
* - If `data` includes a key that matches an existing item, that item is updated.
* - Otherwise, a new item is created.
* After updating or creating, the item is validated. If validation fails, the item is logged and returned without being saved.
* If validation succeeds for a new item, it is added to the collection and marked for saving.
*
* If the item’s `init()` method is async, a promise is returned that resolves once init completes.
*
* @param {Object} [data={}] - Data for creating/updating an item.
* @returns {Promise<Item>|Item} The created or updated item. May return a promise if `init()` is async.
*/
create_or_update(data = {}) {
const existing_item = this.find_by(data);
const item = existing_item ? existing_item : new this.item_type(this.env);
item._queue_save = !existing_item;
const data_changed = item.update_data(data);
if (!existing_item && !item.validate_save()) {
return item;
}
if (!existing_item) {
this.set(item);
}
if (existing_item && !data_changed)
return existing_item;
if (item.init instanceof AsyncFunction2) {
return new Promise((resolve) => {
item.init(data).then(() => resolve(item));
});
}
item.init(data);
return item;
}
/**
* Finds an item by partial data match (first checks key). If `data.key` provided,
* returns the item with that key; otherwise attempts a match by merging data.
*
* @param {Object} data - Data to match against.
* @returns {Item|null}
*/
find_by(data) {
if (data.key)
return this.get(data.key);
const temp = new this.item_type(this.env);
const temp_data = JSON.parse(JSON.stringify(data, temp.sanitize_data(data)));
deep_merge3(temp.data, temp_data);
return temp.key ? this.get(temp.key) : null;
}
/**
* Filters items based on provided filter options or a custom function.
*
* @param {Object|Function} [filter_opts={}] - Filter options or a predicate function.
* @returns {Item[]} Array of filtered items.
*/
filter(filter_opts = {}) {
if (typeof filter_opts === "function") {
return Object.values(this.items).filter(filter_opts);
}
filter_opts = this.prepare_filter(filter_opts);
const results = [];
const { first_n } = filter_opts;
for (const item of Object.values(this.items)) {
if (first_n && results.length >= first_n)
break;
if (item.filter(filter_opts))
results.push(item);
}
return results;
}
/**
* Alias for `filter()`
* @param {Object|Function} filter_opts
* @returns {Item[]}
*/
list(filter_opts) {
return this.filter(filter_opts);
}
/**
* Prepares filter options. Can be overridden by subclasses to normalize filter options.
*
* @param {Object} filter_opts
* @returns {Object} Prepared filter options.
*/
prepare_filter(filter_opts) {
return filter_opts;
}
/**
* Retrieves an item by key.
* @param {string} key
* @returns {Item|undefined}
*/
get(key) {
return this.items[key];
}
/**
* Retrieves multiple items by an array of keys.
* @param {string[]} keys
* @returns {Item[]}
*/
get_many(keys = []) {
if (!Array.isArray(keys)) {
console.error("get_many called with non-array keys:", keys);
return [];
}
return keys.map((key) => this.get(key)).filter(Boolean);
}
/**
* Retrieves a random item from the collection, optionally filtered by options.
* @param {Object} [opts]
* @returns {Item|undefined}
*/
get_rand(opts = null) {
if (opts) {
const filtered = this.filter(opts);
return filtered[Math.floor(Math.random() * filtered.length)];
}
const keys = this.keys;
return this.items[keys[Math.floor(Math.random() * keys.length)]];
}
/**
* Adds or updates an item in the collection.
* @param {Item} item
*/
set(item) {
if (!item.key)
throw new Error("Item must have a key property");
this.items[item.key] = item;
}
/**
* Updates multiple items by their keys.
* @param {string[]} keys
* @param {Object} data
*/
update_many(keys = [], data = {}) {
this.get_many(keys).forEach((item) => item.update_data(data));
}
/**
* Clears all items from the collection.
*/
clear() {
this.items = {};
}
/**
* @returns {string} The collection key, can be overridden by opts.collection_key
*/
get collection_key() {
return this._collection_key ? this._collection_key : this.constructor.collection_key;
}
set collection_key(key) {
this._collection_key = key;
}
/**
* Lazily initializes and returns the data adapter instance for this collection.
* @returns {Object} The data adapter instance.
*/
get data_adapter() {
if (!this._data_adapter) {
const AdapterClass = this.get_adapter_class("data");
this._data_adapter = new AdapterClass(this);
}
return this._data_adapter;
}
get_adapter_class(type) {
const config = this.env.opts.collections?.[this.collection_key];
const adapter_key = type + "_adapter";
const adapter_module = config?.[adapter_key] ?? this.env.opts.collections?.smart_collections?.[adapter_key];
if (typeof adapter_module === "function")
return adapter_module;
if (typeof adapter_module?.collection === "function")
return adapter_module.collection;
throw new Error(`No '${type}' adapter class found for ${this.collection_key} or smart_collections`);
}
/**
* Data directory strategy for this collection. Defaults to 'multi'.
* @returns {string}
*/
get data_dir() {
return this.collection_key;
}
/**
* File system adapter from the environment.
* @returns {Object}
*/
get data_fs() {
return this.env.data_fs;
}
/**
* Derives the corresponding item class name based on this collection's class name.
* @returns {string}
*/
get item_class_name() {
let name = this.constructor.name;
if (name.match(/\d$/))
name = name.slice(0, -1);
if (name.endsWith("ies"))
return name.slice(0, -3) + "y";
else if (name.endsWith("s"))
return name.slice(0, -1);
return name + "Item";
}
/**
* Derives a readable item name from the item class name.
* @returns {string}
*/
get item_name() {
return this.item_class_name.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
}
/**
* Retrieves the item type (constructor) from the environment.
* @returns {Function} Item constructor.
*/
get item_type() {
if (this.opts.item_type)
return this.opts.item_type;
return this.env.item_types[this.item_class_name];
}
/**
* Returns an array of all keys in the collection.
* @returns {string[]}
*/
get keys() {
return Object.keys(this.items);
}
/**
* @deprecated use data_adapter instead (2024-09-14)
*/
get adapter() {
return this.data_adapter;
}
/**
* @method process_save_queue
* @description
* Saves items flagged for saving (_queue_save) back to AJSON or SQLite. This ensures persistent storage
* of any updates made since last load/import. This method also writes changes to disk (AJSON files or DB).
*/
async process_save_queue(opts = {}) {
if (opts.force) {
Object.values(this.items).forEach((item) => item._queue_save = true);
}
await this.data_adapter.process_save_queue(opts);
}
/**
* @alias process_save_queue
* @returns {Promise<void>}
*/
async save(opts = {}) {
await this.process_save_queue(opts);
}
/**
* @method process_load_queue
* @description
* Loads items that have been flagged for loading (_queue_load). This may involve
* reading from AJSON/SQLite or re-importing from markdown if needed.
* Called once initial environment is ready and collections are known.
*/
async process_load_queue() {
await this.data_adapter.process_load_queue();
}
/**
* Retrieves processed settings configuration.
* @returns {Object}
*/
get settings_config() {
return this.process_settings_config({});
}
/**
* Processes given settings config, adding prefixes and handling conditionals.
*
* @private
* @param {Object} _settings_config
* @param {string} [prefix='']
* @returns {Object}
*/
process_settings_config(_settings_config, prefix = "") {
const add_prefix = (key) => prefix && !key.includes(`${prefix}.`) ? `${prefix}.${key}` : key;
return Object.entries(_settings_config).reduce((acc, [key, val]) => {
let new_val = { ...val };
if (new_val.conditional) {
if (!new_val.conditional(this))
return acc;
delete new_val.conditional;
}
if (new_val.callback)
new_val.callback = add_prefix(new_val.callback);
if (new_val.btn_callback)
new_val.btn_callback = add_prefix(new_val.btn_callback);
if (new_val.options_callback)
new_val.options_callback = add_prefix(new_val.options_callback);
const new_key = add_prefix(this.process_setting_key(key));
acc[new_key] = new_val;
return acc;
}, {});
}
/**
* Processes an individual setting key. Override if needed.
* @param {string} key
* @returns {string}
*/
process_setting_key(key) {
return key;
}
/**
* Default settings for this collection. Override in subclasses as needed.
* @returns {Object}
*/
get default_settings() {
return {};
}
/**
* Current settings for the collection.
* Initializes with default settings if none exist.
* @returns {Object}
*/
get settings() {
if (!this.env.settings[this.collection_key]) {
this.env.settings[this.collection_key] = this.default_settings;
}
return this.env.settings[this.collection_key];
}
/**
* @deprecated use env.smart_view instead
* @returns {Object} smart_view instance
*/
get smart_view() {
if (!this._smart_view)
this._smart_view = this.env.init_module("smart_view");
return this._smart_view;
}
/**
* Renders the settings for the collection into a given container.
* @param {HTMLElement} [container=this.settings_container]
* @param {Object} opts
* @returns {Promise<HTMLElement>}
*/
async render_settings(container = this.settings_container, opts = {}) {
return await this.render_collection_settings(container, opts);
}
/**
* Helper function to render collection settings.
* @param {HTMLElement} [container=this.settings_container]
* @param {Object} opts
* @returns {Promise<HTMLElement>}
*/
async render_collection_settings(container = this.settings_container, opts = {}) {
if (container && (!this.settings_container || this.settings_container !== container)) {
this.settings_container = container;
} else if (!container) {
container = this.env.smart_view.create_doc_fragment("<div></div>");
}
container.innerHTML = `<div class="sc-loading">Loading ${this.collection_key} settings...</div>`;
const frag = await this.env.render_component("settings", this, opts);
container.innerHTML = "";
container.appendChild(frag);
return container;
}
/**
* Unloads collection data from memory.
*/
unload() {
this.clear();
this.unloaded = true;
this.env.collections[this.collection_key] = null;
}
/**
* Helper function to render a component in the collection scope
* @param {*} component_key
* @param {*} opts
* @returns
*/
async render_component(component_key, opts = {}) {
return await this.env.render_component(component_key, this, opts);
}
show_process_notice(process2, opts = {}) {
if (!this.debounce_process_notice)
this.debounce_process_notice = {};
this.debounce_process_notice[process2] = setTimeout(() => {
this.debounce_process_notice[process2] = null;
this.env.notices?.show(process2, { collection_key: this.collection_key, ...opts });
}, 1e3);
}
clear_process_notice(process2) {
if (this.debounce_process_notice?.[process2]) {
clearTimeout(this.debounce_process_notice[process2]);
this.debounce_process_notice[process2] = null;
} else {
this.env.notices?.remove(process2);
}
}
};

var EntitiesVectorAdapter2 = class {
/**
* @constructor
* @param {Object} collection - The collection (SmartEntities or derived class) instance.
*/
constructor(collection) {
this.collection = collection;
}
/**
* Find the nearest entities to the given vector.
* @async
* @param {number[]} vec - The reference vector.
* @param {Object} [filter={}] - Optional filters (limit, exclude, etc.)
* @returns {Promise<Array<{item:Object, score:number}>>} Array of results sorted by score descending.
* @throws {Error} Not implemented by default.
*/
async nearest(vec, filter = {}) {
throw new Error("EntitiesVectorAdapter.nearest() not implemented");
}
/**
* Find the furthest entities from the given vector.
* @async
* @param {number[]} vec - The reference vector.
* @param {Object} [filter={}] - Optional filters (limit, exclude, etc.)
* @returns {Promise<Array<{item:Object, score:number}>>} Array of results sorted by score ascending (furthest).
* @throws {Error} Not implemented by default.
*/
async furthest(vec, filter = {}) {
throw new Error("EntitiesVectorAdapter.furthest() not implemented");
}
/**
* Embed a batch of entities.
* @async
* @param {Object[]} entities - Array of entity instances to embed.
* @returns {Promise<void>}
* @throws {Error} Not implemented by default.
*/
async embed_batch(entities) {
throw new Error("EntitiesVectorAdapter.embed_batch() not implemented");
}
/**
* Process a queue of entities waiting to be embedded.
* Typically, this will call embed_batch in batches and update entities.
* @async
* @param {Object[]} embed_queue - Array of entities to embed.
* @returns {Promise<void>}
* @throws {Error} Not implemented by default.
*/
async process_embed_queue(embed_queue) {
throw new Error("EntitiesVectorAdapter.process_embed_queue() not implemented");
}
};
var EntityVectorAdapter2 = class {
/**
* @constructor
* @param {Object} item - The SmartEntity instance that this adapter is associated with.
*/
constructor(item) {
this.item = item;
}
/**
* Retrieve the current vector embedding for this entity.
* @async
* @returns {Promise<number[]|undefined>} The entity's vector or undefined if not set.
* @throws {Error} Not implemented by default.
*/
async get_vec() {
throw new Error("EntityVectorAdapter.get_vec() not implemented");
}
/**
* Store/update the vector embedding for this entity.
* @async
* @param {number[]} vec - The vector to set.
* @returns {Promise<void>}
* @throws {Error} Not implemented by default.
*/
async set_vec(vec) {
throw new Error("EntityVectorAdapter.set_vec() not implemented");
}
/**
* Delete/remove the vector embedding for this entity.
* @async
* @returns {Promise<void>}
* @throws {Error} Not implemented by default.
*/
async delete_vec() {
throw new Error("EntityVectorAdapter.delete_vec() not implemented");
}
};

function cos_sim2(vector1, vector2) {
if (vector1.length !== vector2.length) {
throw new Error("Vectors must have the same length");
}
let dot_product = 0;
let magnitude1 = 0;
let magnitude2 = 0;
const epsilon = 1e-8;
for (let i = 0; i < vector1.length; i++) {
dot_product += vector1[i] * vector2[i];
magnitude1 += vector1[i] * vector1[i];
magnitude2 += vector2[i] * vector2[i];
}
magnitude1 = Math.sqrt(magnitude1);
magnitude2 = Math.sqrt(magnitude2);
if (magnitude1 < epsilon || magnitude2 < epsilon) {
return 0;
}
return dot_product / (magnitude1 * magnitude2);
}

function results_acc2(_acc, result, ct = 10) {
if (_acc.results.size < ct) {
_acc.results.add(result);
if (_acc.results.size === ct && _acc.min === Number.POSITIVE_INFINITY) {
let { minScore, minObj } = find_min2(_acc.results);
_acc.min = minScore;
_acc.minResult = minObj;
}
} else if (result.score > _acc.min) {
_acc.results.add(result);
_acc.results.delete(_acc.minResult);
let { minScore, minObj } = find_min2(_acc.results);
_acc.min = minScore;
_acc.minResult = minObj;
}
}
function furthest_acc2(_acc, result, ct = 10) {
if (_acc.results.size < ct) {
_acc.results.add(result);
if (_acc.results.size === ct && _acc.max === Number.NEGATIVE_INFINITY) {
let { maxScore, maxObj } = find_max2(_acc.results);
_acc.max = maxScore;
_acc.maxResult = maxObj;
}
} else if (result.score < _acc.max) {
_acc.results.add(result);
_acc.results.delete(_acc.maxResult);
let { maxScore, maxObj } = find_max2(_acc.results);
_acc.max = maxScore;
_acc.maxResult = maxObj;
}
}
function find_min2(results) {
let minScore = Number.POSITIVE_INFINITY;
let minObj = null;
for (const obj of results) {
if (obj.score < minScore) {
minScore = obj.score;
minObj = obj;
}
}
return { minScore, minObj };
}
function find_max2(results) {
let maxScore = Number.NEGATIVE_INFINITY;
let maxObj = null;
for (const obj of results) {
if (obj.score > maxScore) {
maxScore = obj.score;
maxObj = obj;
}
}
return { maxScore, maxObj };
}

function sort_by_score2(a, b) {
const epsilon = 1e-9;
const score_diff = a.score - b.score;
if (Math.abs(score_diff) < epsilon)
return 0;
return score_diff > 0 ? -1 : 1;
}
function sort_by_score_descending2(a, b) {
return sort_by_score2(a, b);
}
function sort_by_score_ascending2(a, b) {
return sort_by_score2(a, b) * -1;
}

var DefaultEntitiesVectorAdapter2 = class extends EntitiesVectorAdapter2 {
constructor(collection) {
super(collection);
this._is_processing_embed_queue = false;
this._reset_embed_queue_stats();
}
/**
* Find the nearest entities to the given vector.
* @async
* @param {number[]} vec - The reference vector.
* @param {Object} [filter={}] - Optional filters (limit, exclude, etc.)
* @returns {Promise<Array<{item:Object, score:number}>>} Array of results sorted by score descending.
*/
async nearest(vec, filter = {}) {
if (!vec || !Array.isArray(vec)) {
throw new Error("Invalid vector input to nearest()");
}
const {
limit = 50
} = filter;
const nearest = this.collection.filter(filter).reduce((acc, item) => {
if (!item.vec)
return acc;
const result = { item, score: cos_sim2(vec, item.vec) };
results_acc2(acc, result, limit);
return acc;
}, { min: 0, results: /* @__PURE__ */ new Set() });
return Array.from(nearest.results).sort(sort_by_score_descending2);
}
/**
* Find the furthest entities from the given vector.
* @async
* @param {number[]} vec - The reference vector.
* @param {Object} [filter={}] - Optional filters (limit, exclude, etc.)
* @returns {Promise<Array<{item:Object, score:number}>>} Array of results sorted by score ascending (furthest).
*/
async furthest(vec, filter = {}) {
if (!vec || !Array.isArray(vec)) {
throw new Error("Invalid vector input to furthest()");
}
const {
limit = 50
} = filter;
const furthest = this.collection.filter(filter).reduce((acc, item) => {
if (!item.vec)
return acc;
const result = { item, score: cos_sim2(vec, item.vec) };
furthest_acc2(acc, result, limit);
return acc;
}, { max: 0, results: /* @__PURE__ */ new Set() });
return Array.from(furthest.results).sort(sort_by_score_ascending2);
}
/**
* Embed a batch of entities.
* @async
* @param {Object[]} entities - Array of entity instances to embed.
* @returns {Promise<void>}
*/
async embed_batch(entities) {
if (!this.collection.embed_model) {
throw new Error("No embed_model found in collection for embedding");
}
await Promise.all(entities.map((e) => e.get_embed_input()));
const embeddings = await this.collection.embed_model.embed_batch(entities);
embeddings.forEach((emb, i) => {
const entity = entities[i];
entity.vec = emb.vec;
if (emb.tokens !== void 0)
entity.tokens = emb.tokens;
});
}
/**
* Process a queue of entities waiting to be embedded.
* Prevents multiple concurrent runs by using `_is_processing_embed_queue`.
* @async
* @returns {Promise<void>}
*/
async process_embed_queue() {
if (this._is_processing_embed_queue) {
console.log("process_embed_queue is already running, skipping concurrent call.");
return;
}
this._is_processing_embed_queue = true;
try {
const embed_queue = this.collection.embed_queue;
this._reset_embed_queue_stats();
if (this.collection.embed_model_key === "None") {
console.log(`Smart Connections: No active embedding model for ${this.collection.collection_key}, skipping embedding`);
return;
}
if (!this.collection.embed_model) {
console.log(`Smart Connections: No active embedding model for ${this.collection.collection_key}, skipping embedding`);
return;
}
const datetime_start = /* @__PURE__ */ new Date();
if (!embed_queue.length) {
console.log(`Smart Connections: No items in ${this.collection.collection_key} embed queue`);
return;
}
console.log(`Time spent getting embed queue: ${(/* @__PURE__ */ new Date()).getTime() - datetime_start.getTime()}ms`);
console.log(`Processing ${this.collection.collection_key} embed queue: ${embed_queue.length} items`);
for (let i = 0; i < embed_queue.length; i += this.collection.embed_model.batch_size) {
if (this.is_queue_halted) {
this.is_queue_halted = false;
break;
}
const batch = embed_queue.slice(i, i + this.collection.embed_model.batch_size);
await Promise.all(batch.map((item) => item.get_embed_input()));
try {
const start_time = Date.now();
await this.embed_batch(batch);
this.total_time += Date.now() - start_time;
} catch (e) {
if (e && e.message && e.message.includes("API key not set")) {
this.halt_embed_queue_processing(`API key not set for ${this.collection.embed_model_key}
Please set the API key in the settings.`);
}
console.error(e);
console.error(`Error processing ${this.collection.collection_key} embed queue: ` + JSON.stringify(e || {}, null, 2));
}
batch.forEach((item) => {
item.embed_hash = item.read_hash;
item._queue_save = true;
});
this.embedded_total += batch.length;
this.total_tokens += batch.reduce((acc, item) => acc + (item.tokens || 0), 0);
this._show_embed_progress_notice(embed_queue.length);
if (this.embedded_total - this.last_save_total > 1e3) {
this.last_save_total = this.embedded_total;
await this.collection.process_save_queue();
if (this.collection.block_collection) {
console.log(`Saving ${this.collection.block_collection.collection_key} block collection`);
await this.collection.block_collection.process_save_queue();
}
}
}
this._show_embed_completion_notice(embed_queue.length);
await this.collection.process_save_queue();
if (this.collection.block_collection) {
await this.collection.block_collection.process_save_queue();
}
} finally {
this._is_processing_embed_queue = false;
}
}
/**
* Displays the embedding progress notice.
* @private
* @returns {void}
*/
_show_embed_progress_notice(embed_queue_length) {
if (this.embedded_total - this.last_notice_embedded_total < 100)
return;
this.last_notice_embedded_total = this.embedded_total;
this.notices?.show("embedding_progress", {
progress: this.embedded_total,
total: embed_queue_length,
tokens_per_second: this._calculate_embed_tokens_per_second(),
model_name: this.collection.embed_model_key
});
}
/**
* Displays the embedding completion notice.
* @private
* @returns {void}
*/
_show_embed_completion_notice() {
this.notices?.remove("embedding_progress");
this.notices?.show("embedding_complete", {
total_embeddings: this.embedded_total,
tokens_per_second: this._calculate_embed_tokens_per_second(),
model_name: this.collection.embed_model_key
});
}
/**
* Halts the embed queue processing.
* @param {string|null} msg - Optional message.
*/
halt_embed_queue_processing(msg = null) {
this.is_queue_halted = true;
console.log("Embed queue processing halted");
this.notices?.remove("embedding_progress");
this.notices?.show("embedding_paused", {
progress: this.embedded_total,
total: this.collection._embed_queue.length,
tokens_per_second: this._calculate_embed_tokens_per_second(),
model_name: this.collection.embed_model_key
});
}
/**
* Resumes the embed queue processing after a delay.
* @param {number} [delay=0] - The delay in milliseconds before resuming.
* @returns {void}
*/
resume_embed_queue_processing(delay = 0) {
console.log("resume_embed_queue_processing");
this.notices?.remove("embedding_paused");
setTimeout(() => {
this.embedded_total = 0;
this.process_embed_queue();
}, delay);
}
/**
* Calculates the number of tokens processed per second.
* @private
* @returns {number} Tokens per second.
*/
_calculate_embed_tokens_per_second() {
const elapsed_time = this.total_time / 1e3;
return Math.round(this.total_tokens / (elapsed_time || 1));
}
/**
* Resets the statistics related to embed queue processing.
* @private
* @returns {void}
*/
_reset_embed_queue_stats() {
this.collection._embed_queue = [];
this.embedded_total = 0;
this.is_queue_halted = false;
this.last_save_total = 0;
this.last_notice_embedded_total = 0;
this.total_tokens = 0;
this.total_time = 0;
}
get notices() {
return this.collection.notices;
}
};
var DefaultEntityVectorAdapter2 = class extends EntityVectorAdapter2 {
get data() {
return this.item.data;
}
/**
* Retrieve the current vector embedding for this entity.
* @async
* @returns {Promise<number[]|undefined>} The entity's vector or undefined if not set.
*/
async get_vec() {
return this.vec;
}
/**
* Store/update the vector embedding for this entity.
* @async
* @param {number[]} vec - The vector to set.
* @returns {Promise<void>}
*/
async set_vec(vec) {
this.vec = vec;
}
/**
* Delete/remove the vector embedding for this entity.
* @async
* @returns {Promise<void>}
*/
async delete_vec() {
if (this.item.data?.embeddings?.[this.item.embed_model_key]) {
delete this.item.data.embeddings[this.item.embed_model_key].vec;
}
}
get vec() {
return this.item.data?.embeddings?.[this.item.embed_model_key]?.vec;
}
set vec(vec) {
if (!this.item.data.embeddings) {
this.item.data.embeddings = {};
}
if (!this.item.data.embeddings[this.item.embed_model_key]) {
this.item.data.embeddings[this.item.embed_model_key] = {};
}
this.item.data.embeddings[this.item.embed_model_key].vec = vec;
}
};

async function render4(entity, opts = {}) {
let markdown;
if (should_render_embed2(entity))
markdown = `${entity.embed_link}

${await entity.read()}`;
else
markdown = process_for_rendering2(await entity.read());
let frag;
if (entity.env.settings.smart_view_filter.render_markdown)
frag = await this.render_markdown(markdown, entity);
else
frag = this.create_doc_fragment(markdown);
return await post_process3.call(this, entity, frag, opts);
}
function process_for_rendering2(content) {
if (content.includes("```dataview"))
content = content.replace(/```dataview/g, "```\\dataview");
if (content.includes("![["))
content = content.replace(/\!\[\[/g, "! [[");
return content;
}
async function post_process3(scope, frag, opts = {}) {
return frag;
}
function should_render_embed2(entity) {
if (!entity)
return false;
if (entity.is_media)
return true;
return false;
}

async function find_connections3(params = {}) {
const filter_opts = this.prepare_find_connections_filter_opts(params);
const limit = params.filter?.limit || params.limit || this.env.settings.smart_view_filter?.results_limit || 10;
const cache_key = this.key + JSON.stringify(params);
if (!this.env.connections_cache)
this.env.connections_cache = {};
if (!this.env.connections_cache[cache_key]) {
const connections = (await this.nearest(filter_opts)).sort(sort_by_score2).slice(0, limit);
this.connections_to_cache(cache_key, connections);
}
return this.connections_from_cache(cache_key);
}

var SmartEntity2 = class extends CollectionItem2 {
/**
* Creates an instance of SmartEntity.
* @constructor
* @param {Object} env - The environment instance.
* @param {Object} [opts={}] - Configuration options.
*/
constructor(env, opts = {}) {
super(env, opts);
this.entity_adapter = new DefaultEntityVectorAdapter2(this);
}
/**
* Provides default values for a SmartEntity instance.
* @static
* @readonly
* @returns {Object} The default values.
*/
static get defaults() {
return {
data: {
path: null,
last_embed: {
hash: null
},
embeddings: {}
}
};
}
get vector_adapter() {
if (!this._vector_adapter) {
this._vector_adapter = new this.collection.opts.vector_adapter.item(this);
}
return this._vector_adapter;
}
/**
* Initializes the SmartEntity instance.
* Checks if the entity has a vector and if it matches the model dimensions.
* If not, it queues an embed.
* Removes embeddings for inactive models.
* @returns {void}
*/
init() {
super.init();
if (!this.vec) {
this.queue_embed();
} else if (this.vec.length !== this.embed_model.model_config.dims) {
this.vec = null;
this.queue_embed();
}
Object.entries(this.data.embeddings || {}).forEach(([model, embedding]) => {
if (model !== this.embed_model_key) {
this.data.embeddings[model] = null;
delete this.data.embeddings[model];
}
});
}
/**
* Queues the entity for embedding.
* @returns {void}
*/
queue_embed() {
this._queue_embed = true;
}
/**
* Finds the nearest entities to this entity.
* @param {Object} [filter={}] - Optional filters to apply.
* @returns {Array<{item:Object, score:number}>} An array of result objects with score and item.
*/
async nearest(filter = {}) {
return await this.collection.nearest_to(this, filter);
}
/**
* Prepares the input for embedding.
* @async
* @param {string} [content=null] - Optional content to use instead of calling subsequent read()
* @returns {Promise<void>} Should be overridden in child classes.
*/
async get_embed_input(content = null) {
}
/**
* Retrieves the embed input, either from cache or by generating it.
* @readonly
* @returns {string|Promise<string>} The embed input string or a promise resolving to it.
*/
get embed_input() {
return this._embed_input ? this._embed_input : this.get_embed_input();
}
/**
* Prepares filter options for finding connections based on parameters.
* @param {Object} [params={}] - Parameters for finding connections.
* @returns {Object} The prepared filter options.
*/
prepare_find_connections_filter_opts(params = {}) {
const opts = {
...this.env.settings.smart_view_filter || {},
...params,
entity: this
};
if (opts.filter?.limit)
delete opts.filter.limit;
if (opts.limit)
delete opts.limit;
return opts;
}
/**
* Finds connections relevant to this entity based on provided parameters.
* @async
* @param {Object} [params={}] - Parameters for finding connections.
* @returns {Array<{item:Object, score:number}>} An array of result objects with score and item.
*/
async find_connections(params = {}) {
return await this.actions.find_connections(params);
}
/**
* Retrieves connections from the cache based on the cache key.
* @param {string} cache_key - The cache key.
* @returns {Array<{item:Object, score:number}>} The cached connections.
*/
connections_from_cache(cache_key) {
return this.env.connections_cache[cache_key];
}
/**
* Stores connections in the cache with the provided cache key.
* @param {string} cache_key - The cache key.
* @param {Array<{item:Object, score:number}>} connections - The connections to cache.
* @returns {void}
*/
connections_to_cache(cache_key, connections) {
this.env.connections_cache[cache_key] = connections;
}
get read_hash() {
return this.data.last_read?.hash;
}
set read_hash(hash) {
if (!this.data.last_read)
this.data.last_read = {};
this.data.last_read.hash = hash;
}
get embedding_data() {
if (!this.data.embeddings[this.embed_model_key]) {
this.data.embeddings[this.embed_model_key] = {};
}
return this.data.embeddings[this.embed_model_key];
}
get last_embed() {
if (!this.embedding_data.last_embed) {
this.embedding_data.last_embed = {};
if (this.data.last_embed) {
this.embedding_data.last_embed = this.data.last_embed;
delete this.data.last_embed;
this.queue_save();
}
}
return this.embedding_data.last_embed;
}
get embed_hash() {
return this.last_embed?.hash;
}
set embed_hash(hash) {
if (!this.embedding_data.last_embed)
this.embedding_data.last_embed = {};
this.embedding_data.last_embed.hash = hash;
}
/**
* Gets the embed link for the entity.
* @readonly
* @returns {string} The embed link.
*/
get embed_link() {
return `![[${this.path}]]`;
}
/**
* Gets the key of the embedding model.
* @readonly
* @returns {string} The embedding model key.
*/
get embed_model_key() {
return this.collection.embed_model_key;
}
/**
* Gets the name of the entity, formatted based on settings.
* @readonly
* @returns {string} The entity name.
*/
get name() {
return (!this.should_show_full_path ? this.path.split("/").pop() : this.path.split("/").join(" > ")).split("#").join(" > ").replace(".md", "");
}
/**
* Determines whether to show the full path of the entity.
* @readonly
* @returns {boolean} True if the full path should be shown, false otherwise.
*/
get should_show_full_path() {
return this.env.settings.smart_view_filter?.show_full_path;
}
/**
* @deprecated Use embed_model instead.
* @readonly
* @returns {Object} The smart embedding model.
*/
get smart_embed() {
return this.embed_model;
}
/**
* Gets the embedding model instance from the collection.
* @readonly
* @returns {Object} The embedding model instance.
*/
get embed_model() {
return this.collection.embed_model;
}
/**
* Determines if the entity should be embedded.
* @readonly
* @returns {boolean} True if no vector is set, false otherwise.
*/
get should_embed() {
return !this.vec && this.size > (this.settings?.min_chars || 300);
}
/**
* Sets the error for the embedding model.
* @param {string} error - The error message.
*/
set error(error) {
this.data.embeddings[this.embed_model_key].error = error;
}
/**
* Gets the number of tokens associated with the entity's embedding.
* @readonly
* @returns {number|undefined} The number of tokens, or undefined if not set.
*/
get tokens() {
return this.last_embed?.tokens;
}
/**
* Sets the number of tokens for the embedding.
* @param {number} tokens - The number of tokens.
*/
set tokens(tokens) {
this.last_embed.tokens = tokens;
}
/**
* Gets the vector representation from the entity adapter.
* @readonly
* @returns {Array<number>|undefined} The vector or undefined if not set.
*/
get vec() {
return this.entity_adapter.vec;
}
/**
* Sets the vector representation in the entity adapter.
* @param {Array<number>} vec - The vector to set.
*/
set vec(vec) {
this.entity_adapter.vec = vec;
this._queue_embed = false;
this._embed_input = null;
this.queue_save();
}
/**
* Removes all embeddings from the entity.
* @returns {void}
*/
remove_embeddings() {
this.data.embeddings = null;
this.queue_save();
}
/**
* Retrieves the key of the entity.
* @returns {string} The entity key.
*/
get_key() {
return this.data.key || this.data.path;
}
/**
* Retrieves the path of the entity.
* @readonly
* @returns {string|null} The entity path.
*/
get path() {
return this.data.path;
}
/**
* Gets the component responsible for rendering the entity.
* @readonly
* @returns {Function} The render function for the entity component.
*/
get component() {
return render4;
}
get is_unembedded() {
if (!this.vec)
return true;
if (!this.embed_hash || this.embed_hash !== this.read_hash)
return true;
return false;
}
get connections_component() {
if (!this._connections_component)
this._connections_component = this.components?.connections?.bind(this.smart_view);
return this._connections_component;
}
async render_connections(container, opts = {}) {
if (container)
container.innerHTML = "Loading connections...";
const frag = await this.env.render_component("connections", this, opts);
if (container) {
container.innerHTML = "";
container.appendChild(frag);
}
return frag;
}
};

var SmartEntities2 = class extends Collection2 {
/**
* Creates an instance of SmartEntities.
* @constructor
* @param {Object} env - The environment instance.
* @param {Object} opts - Configuration options.
*/
constructor(env, opts) {
super(env, opts);
this.entities_vector_adapter = new DefaultEntitiesVectorAdapter2(this);
this.model_instance_id = null;
this._embed_queue = [];
}
/**
* Initializes the SmartEntities instance by loading embeddings.
* @async
* @returns {Promise<void>}
*/
async init() {
await super.init();
await this.load_smart_embed();
if (!this.embed_model) {
console.log(`SmartEmbed not loaded for **${this.collection_key}**. Continuing without embedding capabilities.`);
}
}
/**
* Loads the smart embedding model.
* @async
* @returns {Promise<void>}
*/
async load_smart_embed() {
if (this.embed_model_key === "None")
return;
if (!this.embed_model)
return;
if (this.embed_model.is_loading)
return console.log(`SmartEmbedModel already loading for ${this.embed_model_key}`);
if (this.embed_model.is_loaded)
return console.log(`SmartEmbedModel already loaded for ${this.embed_model_key}`);
try {
console.log(`Loading SmartEmbedModel in ${this.collection_key}, current state: ${this.embed_model.state}`);
await this.embed_model.load();
} catch (e) {
console.error(`Error loading SmartEmbedModel for ${this.embed_model.model_key}`);
console.error(e);
}
}
/**
* Unloads the smart embedding model.
* @async
* @returns {Promise<void>}
*/
async unload() {
if (typeof this.embed_model?.unload === "function") {
this.embed_model.unload();
}
super.unload();
}
/**
* Gets the key of the embedding model.
* @readonly
* @returns {string} The embedding model key.
*/
get embed_model_key() {
return this.embed_model?.model_key;
}
/**
* Gets or creates the container for smart embeddings in the DOM.
* @readonly
* @returns {HTMLElement|undefined} The container element or undefined if not available.
*/
get smart_embed_container() {
if (!this.model_instance_id)
return console.log("model_key not set");
const id = this.model_instance_id.replace(/[^a-zA-Z0-9]/g, "_");
if (!window.document)
return console.log("window.document not available");
if (window.document.querySelector(`#${id}`))
return window.document.querySelector(`#${id}`);
const container = window.document.createElement("div");
container.id = id;
window.document.body.appendChild(container);
return container;
}
/**
* @deprecated Use embed_model instead.
* @readonly
* @returns {Object} The smart embedding model.
*/
get smart_embed() {
return this.embed_model;
}
/**
* Gets the embedding model instance.
* @readonly
* @returns {Object|null} The embedding model instance or null if none.
*/
get embed_model() {
if (!this.env._embed_model && this.env.opts.modules.smart_embed_model?.class)
this.env._embed_model = new this.env.opts.modules.smart_embed_model.class({
settings: this.settings.embed_model,
adapters: this.env.opts.modules.smart_embed_model?.adapters,
re_render_settings: this.re_render_settings.bind(this),
reload_model: this.reload_embed_model.bind(this)
});
return this.env._embed_model;
}
set embed_model(embed_model) {
this.env._embed_model = embed_model;
}
reload_embed_model() {
console.log("reload_embed_model");
this.embed_model.unload();
this.env._embed_model = null;
}
re_render_settings() {
this.settings_container.innerHTML = "";
this.render_settings();
}
/**
* Finds the nearest entities to a given entity.
* @async
* @param {Object} entity - The reference entity.
* @param {Object} [filter={}] - Optional filters to apply.
* @returns {Promise<Array<{item:Object, score:number}>>} An array of result objects with score and item.
*/
async nearest_to(entity, filter = {}) {
return await this.nearest(entity.vec, filter);
}
/**
* Finds the nearest entities to a vector using the default adapter.
* @async
* @param {Array<number>} vec - The vector to compare against.
* @param {Object} [filter={}] - Optional filters to apply.
* @returns {Promise<Array<{item:Object, score:number}>>} An array of result objects with score and item.
*/
async nearest(vec, filter = {}) {
if (!vec) {
console.warn("nearest: no vec");
return [];
}
return await this.entities_vector_adapter.nearest(vec, filter);
}
/**
* Finds the furthest entities from a vector using the default adapter.
* @async
* @param {Array<number>} vec - The vector to compare against.
* @param {Object} [filter={}] - Optional filters to apply.
* @returns {Promise<Array<{item:Object, score:number}>>} An array of result objects with score and item.
*/
async furthest(vec, filter = {}) {
if (!vec)
return console.warn("furthest: no vec");
return await this.entities_vector_adapter.furthest(vec, filter);
}
/**
* Gets the file name based on collection key and embedding model key.
* @readonly
* @returns {string} The constructed file name.
*/
get file_name() {
return this.collection_key + "-" + this.embed_model_key.split("/").pop();
}
/**
* Calculates the relevance of an item based on the search filter.
* @param {Object} item - The item to calculate relevance for.
* @param {Object} search_filter - The search filter containing keywords.
* @returns {number} The relevance score:
*                   1 if any keyword is found in the item's path,
*                   0 otherwise (default relevance for keyword in content).
*/
calculate_relevance(item, search_filter) {
if (search_filter.keywords.some((keyword) => item.path?.includes(keyword)))
return 1;
return 0;
}
/**
* Prepares the filter options by incorporating entity-based filters.
* @param {Object} [opts={}] - The filter options.
* @param {Object} [opts.entity] - The entity to base the filters on.
* @param {string|string[]} [opts.exclude_filter] - Keys or prefixes to exclude.
* @param {string|string[]} [opts.include_filter] - Keys or prefixes to include.
* @param {boolean} [opts.exclude_inlinks] - Whether to exclude inlinks of the entity.
* @param {boolean} [opts.exclude_outlinks] - Whether to exclude outlinks of the entity.
* @returns {Object} The modified filter options.
*/
prepare_filter(opts = {}) {
const {
entity,
exclude_filter,
include_filter,
exclude_inlinks,
exclude_outlinks
} = opts;
if (entity) {
if (typeof opts.exclude_key_starts_with_any === "undefined")
opts.exclude_key_starts_with_any = [];
if (opts.exclude_key_starts_with) {
opts.exclude_key_starts_with_any = [
opts.exclude_key_starts_with
];
delete opts.exclude_key_starts_with;
}
opts.exclude_key_starts_with_any.push(entity.source_key || entity.key);
if (exclude_filter) {
if (!Array.isArray(opts.exclude_key_includes_any))
opts.exclude_key_includes_any = [];
if (typeof exclude_filter === "string")
opts.exclude_key_includes_any.push(exclude_filter);
else if (exclude_filter.includes(","))
opts.exclude_key_includes_any.push(...exclude_filter.split(","));
}
if (include_filter) {
if (!Array.isArray(opts.key_includes_any))
opts.key_includes_any = [];
if (typeof include_filter === "string")
opts.key_includes_any.push(include_filter);
else if (include_filter.includes(","))
opts.key_includes_any.push(...include_filter.split(","));
}
if (exclude_inlinks && entity?.inlinks?.length) {
if (!Array.isArray(opts.exclude_key_starts_with_any))
opts.exclude_key_starts_with_any = [];
opts.exclude_key_starts_with_any.push(...entity.inlinks);
}
if (exclude_outlinks && entity?.outlinks?.length) {
if (!Array.isArray(opts.exclude_key_starts_with_any))
opts.exclude_key_starts_with_any = [];
opts.exclude_key_starts_with_any.push(...entity.outlinks);
}
}
return opts;
}
/**
* Looks up entities based on hypothetical content.
* @async
* @param {Object} [params={}] - The parameters for the lookup.
* @param {Array<string>} [params.hypotheticals=[]] - The hypothetical content to lookup.
* @param {Object} [params.filter] - The filter to use for the lookup.
* @param {number} [params.k] - Deprecated: Use `filter.limit` instead.
* @returns {Promise<Array<Result>|Object>} The lookup results or an error object.
*/
async lookup(params = {}) {
const { hypotheticals = [] } = params;
if (!hypotheticals?.length)
return { error: "hypotheticals is required" };
if (!this.embed_model)
return { error: "Embedding search is not enabled." };
const hyp_vecs = await this.embed_model.embed_batch(hypotheticals.map((h) => ({ embed_input: h })));
const limit = params.filter?.limit || params.k || this.env.settings.lookup_k || 10;
if (params.filter?.limit)
delete params.filter.limit;
const filter = {
...this.env.chats?.current?.scope || {},
...params.filter || {}
};
const results = await hyp_vecs.reduce(async (acc_promise, embedding, i) => {
const acc = await acc_promise;
const results2 = await this.nearest(embedding.vec, filter);
results2.forEach((result) => {
if (!acc[result.item.path] || result.score > acc[result.item.path].score) {
acc[result.item.path] = {
key: result.item.key,
score: result.score,
item: result.item,
hypothetical_i: i
};
} else {
result.score = acc[result.item.path].score;
}
});
return acc;
}, Promise.resolve({}));
console.log(results);
const top_k = Object.values(results).sort(sort_by_score2).slice(0, limit);
console.log(`Found and returned ${top_k.length} ${this.collection_key}.`);
return top_k;
}
/**
* Gets the configuration for settings.
* @readonly
* @returns {Object} The settings configuration.
*/
get settings_config() {
return settings_config3;
}
async render_settings(container = this.settings_container, opts = {}) {
container = await this.render_collection_settings(container, opts);
const embed_model_settings_frag = await this.env.render_component("settings", this.embed_model, opts);
container.appendChild(embed_model_settings_frag);
return container;
}
/**
* Gets the notices from the environment.
* @readonly
* @returns {Object} The notices object.
*/
get notices() {
return this.env.smart_connections_plugin?.notices || this.env.main?.notices;
}
/**
* Gets the embed queue containing items to be embedded.
* @readonly
* @returns {Array<Object>} The embed queue.
*/
get embed_queue() {
if (!this._embed_queue?.length)
this._embed_queue = Object.values(this.items).filter((item) => item._queue_embed && item.should_embed);
return this._embed_queue;
}
/**
* Processes the embed queue by delegating to the default vector adapter.
* @async
* @returns {Promise<void>}
*/
async process_embed_queue() {
await this.entities_vector_adapter.process_embed_queue();
}
/**
* Handles changes to the embedding model by reinitializing and processing the load queue.
* @async
* @returns {Promise<void>}
*/
async embed_model_changed() {
await this.unload();
await this.init();
this.render_settings();
await this.process_load_queue();
}
get connections_filter_config() {
return connections_filter_config2;
}
};
var settings_config3 = {
"min_chars": {
name: "Minimum length",
type: "number",
description: "Minimum length of entity to embed (in characters).",
placeholder: "Enter number ex. 300",
default: 300
}
};
var connections_filter_config2 = {
"smart_view_filter.show_full_path": {
"name": "Show full path",
"type": "toggle",
"description": "Show full path in view."
},
"smart_view_filter.render_markdown": {
"name": "Render markdown",
"type": "toggle",
"description": "Render markdown in results."
},
"smart_view_filter.results_limit": {
"name": "Results limit",
"type": "number",
"description": "Limit the number of results.",
"default": 20
},
"smart_view_filter.exclude_inlinks": {
"name": "Exclude inlinks (backlinks)",
"type": "toggle",
"description": "Exclude notes that link to the current note."
},
"smart_view_filter.exclude_outlinks": {
"name": "Exclude outlinks",
"type": "toggle",
"description": "Exclude links already in the current document."
},
"smart_view_filter.include_filter": {
"name": "Include filter",
"type": "text",
"description": "Require that result file path matches this value."
},
"smart_view_filter.exclude_filter": {
"name": "Exclude filter",
"type": "text",
"description": "Exclude results with file path that matches this value."
}
};

async function create_hash2(text) {
if (text.length > 1e5)
text = text.substring(0, 1e5);
const msgUint8 = new TextEncoder().encode(text.trim());
const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
const hashArray = Array.from(new Uint8Array(hashBuffer));
const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
return hashHex;
}

var SmartBlock = class extends SmartEntity2 {
/**
* Provides default values for a SmartBlock instance.
* @static
* @readonly
* @returns {Object} The default values.
*/
static get defaults() {
return {
data: {
text: null,
length: 0,
last_read: {
hash: null,
at: 0
}
},
_embed_input: ""
};
}
get block_adapter() {
if (!this._block_adapter) {
this._block_adapter = new this.collection.opts.block_adapters.md(this);
}
return this._block_adapter;
}
/**
* Initializes the SmartBlock instance by queuing an embed if embedding is enabled.
* @returns {void}
*/
init() {
if (this.settings.embed_blocks)
super.init();
}
/**
* Queues the entity for embedding.
* @returns {void}
*/
queue_embed() {
this._queue_embed = true;
this.source?.queue_embed();
}
/**
* Queues the block for import via the source.
* @returns {void}
*/
queue_import() {
this.source?.queue_import();
}
/**
* Updates the block's data, clearing embeddings if necessary and preparing embed input.
* @param {Object} data - The new data to merge into the block.
* @returns {boolean} `true` if data was updated successfully.
*/
update_data(data) {
if (this.should_clear_embeddings(data)) {
this.data.embeddings = {};
}
super.update_data(data);
return true;
}
/**
* Determines whether to clear embeddings based on the new data.
* @param {Object} data - The new data to evaluate.
* @returns {boolean} `true` if embeddings should be cleared, `false` otherwise.
*/
should_clear_embeddings(data) {
if (this.is_new)
return true;
if (this.embed_model && this.vec?.length !== this.embed_model.model_config.dims)
return true;
return false;
}
/**
* Prepares the embed input for the SmartBlock by reading content and generating a hash.
* @async
* @returns {Promise<string|false>} The embed input string or `false` if already embedded.
*/
async get_embed_input(content = null) {
if (typeof this._embed_input !== "string" || !this._embed_input.length) {
if (!content)
content = await this.read();
this._embed_input = this.breadcrumbs + "\n" + content;
}
return this._embed_input;
}
/**
* @method read
* @description Reads the block content by delegating to the block adapter.
* @async
* @returns {Promise<string>} The block content.
*/
async read() {
try {
return await this.block_adapter.read();
} catch (e) {
if (e.message.includes("BLOCK NOT FOUND")) {
return 'BLOCK NOT FOUND (run "Prune" to remove)';
} else {
throw e;
}
}
}
/**
* @method append
* @description Appends content to this block by delegating to the block adapter.
* @async
* @param {string} content
* @returns {Promise<void>}
*/
async append(content) {
await this.block_adapter.append(content);
this.queue_save();
}
/**
* @method update
* @description Updates the block content by delegating to the block adapter.
* @async
* @param {string} new_block_content
* @param {Object} [opts={}]
* @returns {Promise<void>}
*/
async update(new_block_content, opts = {}) {
await this.block_adapter.update(new_block_content, opts);
this.queue_save();
}
/**
* @method remove
* @description Removes the block by delegating to the block adapter.
* @async
* @returns {Promise<void>}
*/
async remove() {
await this.block_adapter.remove();
this.queue_save();
}
/**
* @method move_to
* @description Moves the block to another location by delegating to the block adapter.
* @async
* @param {string} to_key
* @returns {Promise<void>}
*/
async move_to(to_key) {
await this.block_adapter.move_to(to_key);
this.queue_save();
}
/**
* Retrieves the breadcrumbs representing the block's path within the source.
* @readonly
* @returns {string} The breadcrumbs string.
*/
get breadcrumbs() {
return this.key.split("/").join(" > ").split("#").slice(0, -1).join(" > ").replace(".md", "");
}
/**
* Determines if the block is excluded from embedding based on headings.
* @readonly
* @returns {boolean} `true` if excluded, `false` otherwise.
*/
get excluded() {
const block_headings = this.path.split("#").slice(1);
if (this.source_collection.excluded_headings.some((heading) => block_headings.includes(heading)))
return true;
return this.source.excluded;
}
/**
* Retrieves the file path of the SmartSource associated with the block.
* @readonly
* @returns {string} The file path.
*/
get file_path() {
return this.source?.file_path;
}
/**
* Retrieves the file type of the SmartSource associated with the block.
* @readonly
* @returns {string} The file type.
*/
get file_type() {
return this.source.file_type;
}
/**
* Retrieves the folder path of the block.
* @readonly
* @returns {string} The folder path.
*/
get folder() {
return this.path.split("/").slice(0, -1).join("/");
}
/**
* Retrieves the embed link for the block.
* @readonly
* @returns {string} The embed link.
*/
get embed_link() {
return `![[${this.link}]]`;
}
/**
* Determines if the block has valid line range information.
* @readonly
* @returns {boolean} `true` if the block has both start and end lines, `false` otherwise.
*/
get has_lines() {
return this.lines && this.lines.length === 2;
}
/**
* Determines if the entity is a block based on its key.
* @readonly
* @returns {boolean} `true` if it's a block, `false` otherwise.
*/
get is_block() {
return this.key.includes("#");
}
/**
* Determines if the block is gone (i.e., the source file or block data no longer exists).
* @readonly
* @returns {boolean} `true` if gone, `false` otherwise.
*/
get is_gone() {
if (!this.source?.file)
return true;
if (!this.source?.data?.blocks?.[this.sub_key])
return true;
return false;
}
get last_read() {
return this.data.last_read;
}
/**
* Retrieves the sub-key of the block.
* @readonly
* @returns {string} The sub-key.
*/
get sub_key() {
return "#" + this.key.split("#").slice(1).join("#");
}
/**
* Retrieves the lines range of the block.
* @readonly
* @returns {Array<number>|undefined} An array containing the start and end lines or `undefined` if not set.
*/
get lines() {
return this.data.lines;
}
/**
* Retrieves the starting line number of the block.
* @readonly
* @returns {number|undefined} The starting line number or `undefined` if not set.
*/
get line_start() {
return this.lines?.[0];
}
/**
* Retrieves the ending line number of the block.
* @readonly
* @returns {number|undefined} The ending line number or `undefined` if not set.
*/
get line_end() {
return this.lines?.[1];
}
/**
* Retrieves the link associated with the block, handling page numbers if present.
* @readonly
* @returns {string} The block link.
*/
get link() {
if (/^.*page\s*(\d+).*$/i.test(this.sub_key)) {
const number = this.sub_key.match(/^.*page\s*(\d+).*$/i)[1];
return `${this.source.path}#page=${number}`;
} else {
return this.source?.path || "MISSING SOURCE";
}
}
/**
* Retrieves the display name of the block.
* @readonly
* @returns {string} The display name.
*/
get name() {
const source_name = this.source?.name;
if (!source_name)
return "MISSING SOURCE";
const block_path_parts = this.key.split("#").slice(1);
if (this.should_show_full_path)
return [source_name, ...block_path_parts].join(" > ");
if (block_path_parts[block_path_parts.length - 1][0] === "{")
block_path_parts.pop();
return [source_name, block_path_parts.pop()].join(" > ");
}
get next_block() {
if (!this.data.lines)
return null;
const next_line = this.data.lines[1] + 1;
return this.source.blocks?.find((block) => next_line === block.data?.lines?.[0]);
}
/**
* Retrieves the paths of outlinks from the block.
* @readonly
* @returns {Array<string>} An array of outlink paths.
*/
get outlinks() {
return this.source.outlinks;
}
/**
* Retrieves the path of the SmartBlock.
* @readonly
* @returns {string} The path of the SmartBlock.
*/
get path() {
return this.key;
}
/**
* Determines if the block should be embedded based on its coverage and size.
* @readonly
* @returns {boolean} `true` if it should be embedded, `false` otherwise.
*/
get should_embed() {
try {
if (this.settings?.min_chars && this.size < this.settings.min_chars)
return false;
const match_line_start = this.line_start + 1;
const match_line_end = this.line_end;
const { has_line_start, has_line_end } = Object.entries(this.source?.data?.blocks || {}).reduce((acc, [key, range]) => {
if (!key.startsWith(this.sub_key + "#"))
return acc;
if (range[0] === match_line_start)
acc.has_line_start = key;
if (range[1] === match_line_end)
acc.has_line_end = key;
return acc;
}, { has_line_start: null, has_line_end: null });
if (has_line_start && has_line_end) {
const start_block = this.collection.get(this.source_key + has_line_start);
if (start_block?.should_embed) {
const end_block = this.collection.get(this.source_key + has_line_end);
if (end_block?.should_embed)
return false;
}
}
return true;
} catch (e) {
console.error(e, e.stack);
console.error(`Error getting should_embed for ${this.key}: ` + JSON.stringify(e || {}, null, 2));
}
}
/**
* Retrieves the size of the SmartBlock.
* @readonly
* @returns {number} The size of the SmartBlock.
*/
get size() {
return this.data.size;
}
/**
* Retrieves the SmartSource associated with the block.
* @readonly
* @returns {SmartSource} The associated SmartSource instance.
*/
get source() {
return this.source_collection.get(this.source_key);
}
/**
* Retrieves the SmartSources collection instance.
* @readonly
* @returns {SmartSources} The SmartSources collection.
*/
get source_collection() {
return this.env.smart_sources;
}
get source_key() {
return this.key.split("#")[0];
}
get sub_blocks() {
return this.source?.blocks?.filter((block) => block.key.startsWith(this.key + "#") && block.line_start > this.line_start && block.line_end <= this.line_end) || [];
}
get excluded_lines() {
return this.source.excluded_lines;
}
get file() {
return this.source.file;
}
get is_media() {
return this.source.is_media;
}
get mtime() {
return this.source.mtime;
}
/**
* @deprecated Use `source` instead.
* @readonly
* @returns {SmartSource} The associated SmartSource instance.
*/
get note() {
return this.source;
}
/**
* @deprecated Use `source.key` instead.
* @readonly
* @returns {string} The source key.
*/
get note_key() {
return this.key.split("#")[0];
}
};
var smart_block_default = {
class: SmartBlock,
actions: {
find_connections: find_connections3
}
};

var SmartBlocks = class extends SmartEntities2 {
/**
* Initializes the SmartBlocks instance. Currently muted as processing is handled by SmartSources.
* @returns {void}
*/
init() {
}
get fs() {
return this.env.smart_sources.fs;
}
/**
* Retrieves the embedding model associated with the SmartSources collection.
* @readonly
* @returns {Object|undefined} The embedding model instance or `undefined` if not set.
*/
get embed_model() {
return this.source_collection?.embed_model;
}
/**
* Retrieves the embedding model key from the SmartSources collection.
* @readonly
* @returns {string|undefined} The embedding model key or `undefined` if not set.
*/
get embed_model_key() {
return this.source_collection?.embed_model_key;
}
/**
* Calculates the expected number of blocks based on the SmartSources collection.
* @readonly
* @returns {number} The expected count of blocks.
*/
get expected_blocks_ct() {
return Object.values(this.source_collection.items).reduce((acc, item) => acc += Object.keys(item.data.blocks || {}).length, 0);
}
/**
* Retrieves the notices system from the environment.
* @readonly
* @returns {Object} The notices object.
*/
get notices() {
return this.env.smart_connections_plugin?.notices || this.env.main?.notices;
}
/**
* Retrieves the settings configuration for SmartBlocks.
* @readonly
* @returns {Object} The settings configuration object.
*/
get settings_config() {
return this.process_settings_config({
"embed_blocks": {
name: "Utilize Smart Blocks",
type: "toggle",
description: "Creates more granular embeddings by splitting sources into smaller chunks. This may improve search results especially for large documents that have well-defined sections.",
default: true
},
...super.settings_config
});
}
render_settings(container, opts = {}) {
return this.render_collection_settings(container, opts);
}
get data_dir() {
return "multi";
}
/**
* Retrieves the SmartSources collection instance.
* @readonly
* @returns {SmartSources} The SmartSources collection.
*/
get source_collection() {
return this.env.smart_sources;
}
/**
* Processes the embed queue. Currently handled by SmartSources, so this method is muted.
* @async
* @returns {Promise<void>}
*/
async process_embed_queue() {
}
/**
* Processes the load queue. Currently muted as processing is handled by SmartSources.
* @async
* @returns {Promise<void>}
*/
async process_load_queue() {
}
/**
* @async
* @throws {Error} Throws an error indicating the method is not implemented.
* @returns {Promise<void>}
*/
async prune() {
throw "Not implemented: prune";
}
/**
* @throws {Error} Throws an error indicating the method is not implemented.
* @returns {void}
*/
build_links_map() {
throw "Not implemented: build_links_map";
}
/**
* @async
* @throws {Error} Throws an error indicating the method is not implemented.
* @returns {Promise<void>}
*/
async refresh() {
throw "Not implemented: refresh";
}
/**
* @async
* @throws {Error} Throws an error indicating the method is not implemented.
* @returns {Promise<void>}
*/
async search() {
throw "Not implemented: search";
}
/**
* @async
* @throws {Error} Throws an error indicating the method is not implemented.
* @returns {Promise<void>}
*/
async run_refresh() {
throw "Not implemented: run_refresh";
}
/**
* @async
* @throws {Error} Throws an error indicating the method is not implemented.
* @returns {Promise<void>}
*/
async run_force_refresh() {
throw "Not implemented: run_force_refresh";
}
};

var CollectionDataAdapter2 = class {
/**
* @constructor
* @param {Object} collection - The collection instance that this adapter manages.
*/
constructor(collection) {
this.collection = collection;
this.env = collection.env;
}
/**
* The class to use for item adapters.
* @type {typeof ItemDataAdapter}
*/
ItemDataAdapter = ItemDataAdapter2;
/**
* Optional factory method to create item adapters.
* If `this.item_adapter_class` is not null, it uses that; otherwise can be overridden by subclasses.
* @param {Object} item - The item to create an adapter for.
* @returns {ItemDataAdapter}
*/
create_item_adapter(item) {
if (!this.ItemDataAdapter) {
throw new Error("No item_adapter_class specified and create_item_adapter not overridden.");
}
return new this.ItemDataAdapter(item);
}
/**
* Load a single item by its key using an `ItemDataAdapter`.
* @async
* @param {string} key - The key of the item to load.
* @returns {Promise<void>} Resolves when the item is loaded.
*/
async load_item(key) {
throw new Error("Not implemented");
}
/**
* Save a single item by its key using its associated `ItemDataAdapter`.
* @async
* @param {string} key - The key of the item to save.
* @returns {Promise<void>} Resolves when the item is saved.
*/
async save_item(key) {
throw new Error("Not implemented");
}
/**
* Delete a single item by its key. This may involve updating or removing its file,
* as handled by the `ItemDataAdapter`.
* @async
* @param {string} key - The key of the item to delete.
* @returns {Promise<void>} Resolves when the item is deleted.
*/
async delete_item(key) {
throw new Error("Not implemented");
}
/**
* Process any queued load operations. Typically orchestrates calling `load_item()`
* on items that have been flagged for loading.
* @async
* @returns {Promise<void>}
*/
async process_load_queue() {
throw new Error("Not implemented");
}
/**
* Process any queued save operations. Typically orchestrates calling `save_item()`
* on items that have been flagged for saving.
* @async
* @returns {Promise<void>}
*/
async process_save_queue() {
throw new Error("Not implemented");
}
/**
* Load the item's data from storage if it has been updated externally.
* @async
* @param {string} key - The key of the item to load.
* @returns {Promise<void>} Resolves when the item is loaded.
*/
async load_item_if_updated(item) {
const adapter = this.create_item_adapter(item);
await adapter.load_if_updated();
}
};
var ItemDataAdapter2 = class {
/**
* @constructor
* @param {Object} item - The collection item instance that this adapter manages.
*/
constructor(item) {
this.item = item;
}
/**
* Load the item's data from storage. May involve reading a file and parsing
* its contents, then updating `item.data`.
* @async
* @returns {Promise<void>} Resolves when the item is fully loaded.
*/
async load() {
throw new Error("Not implemented");
}
/**
* Save the item's data to storage. May involve writing to a file or appending
* lines in an append-only format.
* @async
* @param {string|null} [ajson=null] - An optional serialized representation of the item’s data.
*                                     If not provided, the adapter should derive it from the item.
* @returns {Promise<void>} Resolves when the item is saved.
*/
async save(ajson = null) {
throw new Error("Not implemented");
}
/**
* Delete the item's data from storage. May involve removing a file or writing
* a `null` entry in an append-only file to signify deletion.
* @async
* @returns {Promise<void>} Resolves when the item’s data is deleted.
*/
async delete() {
throw new Error("Not implemented");
}
/**
* Returns the file path or unique identifier used by this adapter to locate and store
* the item's data. This may be a file name derived from the item's key.
* @returns {string} The path or identifier for the item's data.
*/
get data_path() {
throw new Error("Not implemented");
}
/**
* @returns {CollectionDataAdapter} The collection data adapter that this item data adapter belongs to.
*/
get collection_adapter() {
return this.item.collection.data_adapter;
}
get env() {
return this.item.env;
}
/**
* Load the item's data from storage if it has been updated externally.
* @async
* @returns {Promise<void>} Resolves when the item is loaded.
*/
async load_if_updated() {
throw new Error("Not implemented");
}
};

var FileCollectionDataAdapter2 = class extends CollectionDataAdapter2 {
/**
* The class to use for item adapters.
* @type {typeof ItemDataAdapter}
*/
ItemDataAdapter = FileItemDataAdapter2;
/**
* @returns {Object} Filesystem interface derived from environment or collection settings.
*/
get fs() {
return this.collection.data_fs || this.collection.env.data_fs;
}
};
var FileItemDataAdapter2 = class extends ItemDataAdapter2 {
/**
* @returns {Object} Filesystem interface derived from environment or collection settings.
*/
get fs() {
return this.item.collection.data_fs || this.item.collection.env.data_fs;
}
get data_path() {
throw new Error("Not implemented");
}
async load_if_updated() {
const data_path = this.data_path;
if (await this.fs.exists(data_path)) {
const loaded_at = this.item.loaded_at || 0;
const data_file_stat = await this.fs.stat(data_path);
if (data_file_stat.mtime > loaded_at + 1 * 60 * 1e3) {
console.log(`Smart Collections: Re-loading item ${this.item.key} because it has been updated on disk`);
await this.load();
}
}
}
};

var class_to_collection_key2 = {
"SmartSource": "smart_sources",
"SmartNote": "smart_sources",
"SmartBlock": "smart_blocks",
"SmartDirectory": "smart_directories"
};
var AjsonMultiFileCollectionDataAdapter2 = class extends FileCollectionDataAdapter2 {
/**
* The class to use for item adapters.
* @type {typeof ItemDataAdapter}
*/
ItemDataAdapter = AjsonMultiFileItemDataAdapter2;
/**
* Load a single item by its key.
* @async
* @param {string} key
* @returns {Promise<void>}
*/
async load_item(key) {
const item = this.collection.get(key);
if (!item)
return;
const adapter = this.create_item_adapter(item);
await adapter.load();
}
/**
* Save a single item by its key.
* @async
* @param {string} key
* @returns {Promise<void>}
*/
async save_item(key) {
const item = this.collection.get(key);
if (!item)
return;
const adapter = this.create_item_adapter(item);
await adapter.save();
}
/**
* Process any queued load operations.
* @async
* @returns {Promise<void>}
*/
async process_load_queue() {
this.collection.show_process_notice("loading_collection");
if (!await this.fs.exists(this.collection.data_dir)) {
await this.fs.mkdir(this.collection.data_dir);
}
const load_queue = Object.values(this.collection.items).filter((item) => item._queue_load);
if (!load_queue.length) {
this.collection.clear_process_notice("loading_collection");
return;
}
console.log(`Loading ${this.collection.collection_key}: ${load_queue.length} items`);
const batch_size = 100;
for (let i = 0; i < load_queue.length; i += batch_size) {
const batch = load_queue.slice(i, i + batch_size);
await Promise.all(batch.map((item) => {
const adapter = this.create_item_adapter(item);
return adapter.load().catch((err) => {
console.warn(`Error loading item ${item.key}`, err);
item.queue_load();
});
}));
}
console.log(`Loaded ${this.collection.collection_key} in ${this.collection.load_time_ms}ms`);
this.collection.loaded = load_queue.length;
this.collection.clear_process_notice("loading_collection");
}
/**
* Process any queued save operations.
* @async
* @returns {Promise<void>}
*/
async process_save_queue() {
this.collection.show_process_notice("saving_collection");
const save_queue = Object.values(this.collection.items).filter((item) => item._queue_save);
console.log(`Saving ${this.collection.collection_key}: ${save_queue.length} items`);
const time_start = Date.now();
const batch_size = 50;
for (let i = 0; i < save_queue.length; i += batch_size) {
const batch = save_queue.slice(i, i + batch_size);
await Promise.all(batch.map((item) => {
const adapter = this.create_item_adapter(item);
return adapter.save().catch((err) => {
console.warn(`Error saving item ${item.key}`, err);
item.queue_save();
});
}));
}
const deleted_items = Object.values(this.collection.items).filter((item) => item.deleted);
if (deleted_items.length) {
deleted_items.forEach((item) => {
delete this.collection.items[item.key];
});
}
console.log(`Saved ${this.collection.collection_key} in ${Date.now() - time_start}ms`);
this.collection.clear_process_notice("saving_collection");
}
get_item_data_path(key) {
return [
this.collection.data_dir || "multi",
this.fs?.sep || "/",
this.get_data_file_name(key) + ".ajson"
].join("");
}
/**
* Transforms the item key into a safe filename.
* Replaces spaces, slashes, and dots with underscores.
* @returns {string} safe file name
*/
get_data_file_name(key) {
return key.split("#")[0].replace(/[\s\/\.]/g, "_").replace(".md", "");
}
/**
* Build a single AJSON line for the given item and data.
* @param {Object} item
* @returns {string}
*/
get_item_ajson(item) {
const collection_key = item.collection_key;
const key = item.key;
const data_value = item.deleted ? "null" : JSON.stringify(item.data);
return `${JSON.stringify(`${collection_key}:${key}`)}: ${data_value},`;
}
};
var AjsonMultiFileItemDataAdapter2 = class extends FileItemDataAdapter2 {
/**
* Derives the `.ajson` file path from the collection's data_dir and item key.
* @returns {string}
*/
get data_path() {
return this.collection_adapter.get_item_data_path(this.item.key);
}
/**
* Load the item from its `.ajson` file.
* @async
* @returns {Promise<void>}
*/
async load() {
try {
const raw_data = await this.fs.adapter.read(this.data_path, "utf-8", { no_cache: true });
if (!raw_data) {
this.item.queue_import();
return;
}
const { rewrite, file_data } = this._parse(raw_data);
if (rewrite) {
if (file_data.length)
await this.fs.write(this.data_path, file_data);
else
await this.fs.remove(this.data_path);
}
const last_import_mtime = this.item.data.last_import?.at || 0;
if (last_import_mtime && this.item.init_file_mtime > last_import_mtime) {
this.item.queue_import();
}
} catch (e) {
this.item.queue_import();
}
}
/**
* Parse the entire AJSON content as a JSON object, handle legacy keys, and extract final state.
* @private
* @param {string} ajson
* @returns {boolean}
*/
_parse(ajson) {
try {
let rewrite = false;
if (!ajson.length)
return false;
ajson = ajson.trim();
const original_line_count = ajson.split("\n").length;
const json_str = "{" + ajson.slice(0, -1) + "}";
const data = JSON.parse(json_str);
const entries = Object.entries(data);
for (let i = 0; i < entries.length; i++) {
const [ajson_key, value] = entries[i];
if (!value) {
delete data[ajson_key];
rewrite = true;
continue;
}
const { collection_key, item_key, changed } = this._parse_ajson_key(ajson_key);
if (changed) {
rewrite = true;
data[collection_key + ":" + item_key] = value;
delete data[ajson_key];
}
const collection = this.env[collection_key];
if (!collection)
continue;
const existing_item = collection.get(item_key);
if (!value.key)
value.key = item_key;
if (existing_item) {
existing_item.data = value;
existing_item._queue_load = false;
existing_item.loaded_at = Date.now();
} else {
const ItemClass = collection.item_type;
const new_item = new ItemClass(this.env, value);
new_item._queue_load = false;
new_item.loaded_at = Date.now();
collection.set(new_item);
}
}
if (rewrite || original_line_count > entries.length) {
rewrite = true;
}
return {
rewrite,
file_data: rewrite ? Object.entries(data).map(([key, value]) => `${JSON.stringify(key)}: ${JSON.stringify(value)},`).join("\n") : null
};
} catch (e) {
if (ajson.split("\n").some((line) => !line.endsWith(","))) {
console.warn("fixing trailing comma error");
ajson = ajson.split("\n").map((line) => line.endsWith(",") ? line : line + ",").join("\n");
return this._parse(ajson);
}
console.warn("Error parsing JSON:", e);
return { rewrite: true, file_data: null };
}
}
_parse_ajson_key(ajson_key) {
let changed;
let [collection_key, ...item_key] = ajson_key.split(":");
if (class_to_collection_key2[collection_key]) {
collection_key = class_to_collection_key2[collection_key];
changed = true;
}
return {
collection_key,
item_key: item_key.join(":"),
changed
};
}
/**
* Save the current state of the item by appending a new line to its `.ajson` file.
* @async
* @returns {Promise<void>}
*/
async save(retries = 0) {
try {
const ajson_line = this.get_item_ajson();
await this.fs.append(this.data_path, "\n" + ajson_line);
this.item._queue_save = false;
} catch (e) {
if (e.code === "ENOENT" && retries < 1) {
const dir = this.collection_adapter.collection.data_dir;
if (!await this.fs.exists(dir)) {
await this.fs.mkdir(dir);
}
return await this.save(retries + 1);
}
console.warn("Error saving item", this.data_path, e);
}
}
/**
* Build a single AJSON line for the given item and data.
* @param {Object} item
* @returns {string}
*/
get_item_ajson() {
return this.collection_adapter.get_item_ajson(this.item);
}
};

var AjsonMultiFileBlocksDataAdapter = class extends AjsonMultiFileCollectionDataAdapter2 {
ItemDataAdapter = AjsonMultiFileBlockDataAdapter;
/**
* Transforms the item key into a safe filename.
* Replaces spaces, slashes, and dots with underscores.
* @returns {string} safe file name
*/
get_data_file_name(key) {
return key.split("#")[0].replace(/[\s\/\.]/g, "_").replace(".md", "");
}
/**
* Process any queued save operations.
* @async
* @returns {Promise<void>}
*/
async process_save_queue() {
this.collection.show_process_notice("saving_collection");
const save_queue = Object.values(this.collection.items).filter((item) => item._queue_save);
console.log(`Saving ${this.collection.collection_key}: ${save_queue.length} items`);
const time_start = Date.now();
const save_files = Object.entries(save_queue.reduce((acc, item) => {
const file_name = this.get_item_data_path(item.key);
acc[file_name] = acc[file_name] || [];
acc[file_name].push(item);
return acc;
}, {}));
for (let i = 0; i < save_files.length; i++) {
const [file_name, items] = save_files[i];
await this.fs.append(
file_name,
items.map((item) => this.get_item_ajson(item)).join("\n") + "\n"
);
items.forEach((item) => item._queue_save = false);
}
console.log(`Saved ${this.collection.collection_key} in ${Date.now() - time_start}ms`);
this.collection.clear_process_notice("saving_collection");
}
process_load_queue() {
console.log(`Skipping loading ${this.collection.collection_key}...`);
}
};
var AjsonMultiFileBlockDataAdapter = class extends AjsonMultiFileItemDataAdapter2 {
};

var BlockContentAdapter = class {
/**
* @constructor
* @param {Object} item - The SmartBlock instance this adapter operates on.
* The `item` should at least provide `data` and references to its parent source.
*/
constructor(item) {
this.item = item;
}
/**
* @async
* @method read
* @abstract
* @returns {Promise<string>} The content of the block.
* @throws {Error} If not implemented by subclass.
*/
async read() {
throw new Error("Not implemented");
}
/**
* @async
* @method append
* @abstract
* @param {string} content Content to append to the block.
* @returns {Promise<void>}
* @throws {Error} If not implemented by subclass.
*/
async append(content) {
throw new Error("Not implemented");
}
/**
* @async
* @method update
* @abstract
* @param {string} new_content The new content for the block.
* @param {Object} [opts={}] Additional update options.
* @returns {Promise<void>}
* @throws {Error} If not implemented by subclass.
*/
async update(new_content, opts = {}) {
throw new Error("Not implemented");
}
/**
* @async
* @method remove
* @abstract
* @returns {Promise<void>}
* @throws {Error} If not implemented by subclass.
*/
async remove() {
throw new Error("Not implemented");
}
/**
* @async
* @method move_to
* @abstract
* @param {string} to_key The destination key (source or block reference).
* @returns {Promise<void>}
* @throws {Error} If not implemented by subclass.
*/
async move_to(to_key) {
throw new Error("Not implemented");
}
/**
* @name data
* @type {Object}
* @readonly
* @description Access the block’s data object. Useful for updating metadata like line references or hashes.
*/
get data() {
return this.item.data;
}
/**
* @async
* @method update_last_read
* @param {string} content The current content of the block.
* @returns {Promise<void>}
* @description Update the block’s `last_read` hash and timestamp based on the given content.
*/
async update_last_read(content) {
this.data.last_read = {
hash: await this.create_hash(content),
at: Date.now()
};
}
/**
* @async
* @method create_hash
* @param {string} content The content to hash.
* @returns {Promise<string>} The computed hash of the content.
* @description Hash the block content to detect changes and prevent unnecessary re-embeddings.
*/
async create_hash(content) {
return await create_hash2(content);
}
};

var MarkdownBlockContentAdapter = class extends BlockContentAdapter {
/**
* Read the content of the block.
* @async
* @returns {Promise<string>} The block content as a string.
* @throws {Error} If the block cannot be found.
*/
async read() {
const source_content = await this.item.source.read();
const content = this._extract_block(source_content);
this.update_last_read(content);
return content;
}
/**
* Append content to the existing block.
* This method inserts additional lines after the block's end, then re-parses the file to update line references.
* @async
* @param {string} content Content to append to the block.
* @returns {Promise<void>}
* @throws {Error} If the block cannot be found.
*/
async append(content) {
let full_content = await this.item.source.read();
const { line_start, line_end } = this.item;
if (!line_start || !line_end) {
throw new Error(`Cannot append to block ${this.item.key}: invalid line references.`);
}
const lines = full_content.split("\n");
lines.splice(line_end, 0, "", content);
const updated_content = lines.join("\n");
await this.item.source._update(updated_content);
await this._reparse_source();
}
/**
* Update the block with new content, replacing its current lines.
* @async
* @param {string} new_content New content for the block.
* @param {Object} [opts={}] Additional options.
* @returns {Promise<void>}
* @throws {Error} If the block cannot be found.
*/
async update(new_content, opts = {}) {
let full_content = await this.item.source.read();
const { line_start, line_end } = this.item;
if (!line_start || !line_end) {
throw new Error(`Cannot update block ${this.item.key}: invalid line references.`);
}
const lines = full_content.split("\n");
const updated_lines = [
...lines.slice(0, line_start - 1),
...new_content.split("\n"),
...lines.slice(line_end)
];
const updated_content = updated_lines.join("\n");
await this.item.source._update(updated_content);
await this._reparse_source();
}
/**
* Remove the block entirely from the source.
* @async
* @returns {Promise<void>}
* @throws {Error} If the block cannot be found.
*/
async remove() {
let full_content = await this.item.source.read();
const { line_start, line_end } = this.item;
if (!line_start || !line_end) {
throw new Error(`Cannot remove block ${this.item.key}: invalid line references.`);
}
const lines = full_content.split("\n");
const updated_lines = [
...lines.slice(0, line_start - 1),
...lines.slice(line_end)
];
const updated_content = updated_lines.join("\n");
await this.item.source._update(updated_content);
await this._reparse_source();
}
/**
* Move the block to a new location (another source or heading).
* This involves reading the block content, removing it from the current source, and appending it to the target.
* @async
* @param {string} to_key The destination path or entity reference.
* @returns {Promise<void>}
* @throws {Error} If the block or target is invalid.
*/
async move_to(to_key) {
const content = await this.read();
await this.remove();
const is_block_ref = to_key.includes("#");
let target_source_key = is_block_ref ? to_key.split("#")[0] : to_key;
const target_source = this.item.env.smart_sources.get(target_source_key);
if (!target_source) {
await this.item.env.smart_sources.create(target_source_key, content);
return;
}
if (is_block_ref) {
const target_block = this.item.env.smart_blocks.get(to_key);
if (target_block) {
await target_block.append(content);
} else {
await target_source.append(content);
}
} else {
await target_source.append(content);
}
}
/**
* Extract the block content using current line references from a full source content.
* @private
* @param {string} source_content Full source file content.
* @returns {string} Extracted block content.
* @throws {Error} If the block cannot be found.
*/
_extract_block(source_content) {
if (!source_content) {
console.warn(`BLOCK NOT FOUND: ${this.item.key} has no source content.`);
return "";
}
const { line_start, line_end } = this.item;
if (!line_start || !line_end) {
throw new Error(`BLOCK NOT FOUND: ${this.item.key} has invalid line references.`);
}
const lines = source_content.split("\n");
const selected = lines.slice(line_start - 1, line_end);
return selected.join("\n");
}
/**
* Re-parse the source file after a CRUD operation to update line references for all blocks.
* @private
* @async
* @returns {Promise<void>}
*/
async _reparse_source() {
await this.item.source.import();
}
};

var import_obsidian10 = require("obsidian");

var import_obsidian3 = require("obsidian");

var NOTICES = {
item_excluded: {
en: "Cannot show Smart Connections for excluded entity: {{entity_key}}"
},
load_env: {
en: "Mobile detected: to prevent performance issues, click to load Smart Environment when ready.",
button: {
en: `Load Smart Env`,
callback: (env) => {
env.manual_load();
}
},
timeout: 0
},
missing_entity: {
en: "No entity found for key: {{key}}"
},
notice_muted: {
en: "Notice muted"
},
new_version_available: {
en: "A new version is available! (v{{version}})",
timeout: 15e3,
button: {
en: "Release notes",
callback: (scope) => {
window.open("https://github.com/brianpetro/obsidian-smart-connections/releases", "_blank");
}
}
},
new_early_access_version_available: {
en: "A new early access version is available! (v{{version}})"
},
supporter_key_required: {
en: "Supporter license key required for early access update"
},
revert_to_stable_release: {
en: 'Click "Check for Updates" in the community plugins tab and complete the update for Smart Connections to finish reverting to the stable release.',
timeout: 0
},
action_installed: {
en: 'Installed action "{{name}}"'
},
action_install_error: {
en: 'Error installing action "{{name}}": {{error}}',
timeout: 0
},
embed_model_not_loaded: {
en: "Embed model not loaded. Please wait for the model to load and try again."
},
embed_search_text_failed: {
en: "Failed to embed search text."
},
error_in_embedding_search: {
en: "Error in embedding search. See console for details."
},
copied_to_clipboard: {
en: "Message: {{content}} copied successfully."
},
copy_failed: {
en: "Unable to copy message to clipboard."
},
copied_chatgpt_url_to_clipboard: {
en: "ChatGPT URL copied to clipboard."
},
loading_collection: {
en: "Loading {{collection_key}}..."
},
done_loading_collection: {
en: "{{collection_key}} loaded."
},
saving_collection: {
en: "Saving {{collection_key}}..."
},
initial_scan: {
en: "[{{collection_key}}] Starting initial scan...",
timeout: 0
},
done_initial_scan: {
en: "[{{collection_key}}] Initial scan complete.",
timeout: 3e3
},
pruning_collection: {
en: "Pruning {{collection_key}}..."
},
done_pruning_collection: {
en: "Pruned {{count}} items from {{collection_key}}."
},
embedding_progress: {
en: "Embedding progress: {{progress}} / {{total}}\n{{tokens_per_second}} tokens/sec using {{model_name}}",
button: {
en: "Pause",
callback: (env) => {
console.log("pausing");
env.smart_sources.entities_vector_adapter.halt_embed_queue_processing();
}
},
timeout: 0
},
embedding_complete: {
en: "Embedding complete. {{total_embeddings}} embeddings created. {{tokens_per_second}} tokens/sec using {{model_name}}",
timeout: 0
},
embedding_paused: {
en: "Embedding paused. Progress: {{progress}} / {{total}}\n{{tokens_per_second}} tokens/sec using {{model_name}}",
button: {
en: "Resume",
callback: (env) => {
env.smart_sources.entities_vector_adapter.resume_embed_queue_processing(100);
}
},
timeout: 0
},
import_progress: {
en: "Importing... {{progress}} / {{total}} sources",
timeout: 0
},
done_import: {
en: "Import complete. {{count}} sources imported in {{time_in_seconds}}s",
timeout: 0
},
no_import_queue: {
en: "No items in import queue"
},
clearing_all: {
en: "Clearing all data...",
timeout: 0
},
done_clearing_all: {
en: "All data cleared and reimported",
timeout: 3e3
},
image_extracting: {
en: "Extracting text from Image(s)",
timeout: 0
},
pdf_extracting: {
en: "Extracting text from PDF(s)",
timeout: 0
},
insufficient_settings: {
en: "Insufficient settings for {{key}}, missing: {{missing}}",
timeout: 0
},
unable_to_init_source: {
en: "Unable to initialize source: {{key}}",
timeout: 0
},
reload_sources: {
en: "Reloaded sources in {{time_ms}}ms"
}
};

function define_default_create_methods(notices) {
for (const key of Object.keys(notices)) {
const notice_obj = notices[key];
if (typeof notice_obj.create !== "function") {
notice_obj.create = function(opts = {}) {
let text = this.en ?? key;
for (const [k, v] of Object.entries(opts)) {
text = text.replace(new RegExp(`{{${k}}}`, "g"), String(v));
}
let button;
if (!opts.button && this.button) {
const btn_label = typeof this.button.en === "string" ? this.button.en : "OK";
button = {
text: btn_label,
callback: typeof this.button.callback === "function" ? this.button.callback : () => {
}
};
} else {
button = opts.button;
}
let final_timeout = opts.timeout ?? this.timeout ?? 5e3;
return {
text,
button,
timeout: final_timeout,
confirm: opts.confirm,
immutable: opts.immutable
};
};
}
}
return notices;
}
var SmartNotices = class {
/**
* @param {Object} scope - The main plugin instance
*/
constructor(env, opts = {}) {
env?.create_env_getter(this);
this.active = {};
this.adapter = opts.adapter || this.env.config.modules.smart_notices.adapter;
define_default_create_methods(NOTICES);
}
/** plugin settings for notices (muted, etc.) */
get settings() {
if (!this.env?.settings?.smart_notices) {
this.env.settings.smart_notices = {};
}
if (!this.env?.settings?.smart_notices?.muted) {
this.env.settings.smart_notices.muted = {};
}
return this.env?.settings?.smart_notices;
}
/**
* Displays a notice by key or custom message.
* Usage:
*   notices.show('load_env', { scope: this });
*
* @param {string} id - The notice key or custom ID
* @param {object} opts - Additional user opts
*/
show(id, opts = {}) {
let message = null;
if (typeof opts === "string") {
message = opts;
} else {
opts = opts || {};
}
const normalized_id = this._normalize_notice_key(id);
if (this.settings?.muted?.[normalized_id]) {
if (opts.confirm?.callback) {
opts.confirm.callback();
}
return;
}
const notice_entry = NOTICES[id];
let derived = {
text: message || id,
timeout: opts.timeout ?? 5e3,
button: opts.button,
immutable: opts.immutable,
confirm: opts.confirm
};
if (notice_entry?.create) {
const result = notice_entry.create({ ...opts });
derived.text = message || result.text;
derived.timeout = result.timeout;
derived.button = result.button;
derived.immutable = result.immutable;
derived.confirm = result.confirm;
}
const content_fragment = this._build_fragment(normalized_id, derived.text, derived);
if (this.active[normalized_id]?.noticeEl?.isConnected) {
return this.active[normalized_id].setMessage(content_fragment, derived.timeout);
}
return this._render_notice(normalized_id, content_fragment, derived);
}
/**
* Normalizes the notice key to a safe string.
*/
_normalize_notice_key(key) {
return key.replace(/[^a-zA-Z0-9_-]/g, "_");
}
/**
* Creates and tracks the notice instance
*/
_render_notice(normalized_id, content_fragment, { timeout }) {
this.active[normalized_id] = new this.adapter(content_fragment, timeout);
return this.active[normalized_id];
}
/**
* Builds a DocumentFragment with notice text & possible buttons
*/
_build_fragment(id, text, { button, confirm: confirm2, immutable }) {
const frag = document.createDocumentFragment();
frag.createEl("p", {
cls: "sc-notice-head",
text: `[Smart Env v${this.env.constructor.version}]`
});
const content = frag.createEl("p", { cls: "sc-notice-content", text });
const actions = frag.createEl("div", { cls: "sc-notice-actions" });
if (confirm2?.text && typeof confirm2.callback === "function") {
this._add_button(confirm2, actions);
}
if (button?.text && typeof button.callback === "function") {
this._add_button(button, actions);
}
if (!immutable) {
this._add_mute_button(id, actions);
}
return frag;
}
/**
* Creates a <button> appended to the container
*/
_add_button(btnConfig, container) {
const btn = document.createElement("button");
btn.innerHTML = btnConfig.text;
btn.addEventListener("click", (e) => {
if (btnConfig.stay_open) {
e.preventDefault();
e.stopPropagation();
}
btnConfig.callback?.(this.env);
});
container.appendChild(btn);
}
/**
* Mute button
*/
_add_mute_button(id, container) {
const btn = document.createElement("button");
(0, import_obsidian3.setIcon)(btn, "bell-off");
btn.addEventListener("click", () => {
if (!this.settings.muted)
this.settings.muted = {};
this.settings.muted[id] = true;
if (NOTICES["notice muted"]) {
this.show("notice muted", null, { timeout: 2e3 });
}
});
container.appendChild(btn);
}
/**
* Hides & clears all active notices
*/
unload() {
for (const id in this.active) {
this.remove(id);
}
}
/**
* Removes an active notice by key
*/
remove(id) {
const normalized_id = this._normalize_notice_key(id);
this.active[normalized_id]?.hide();
delete this.active[normalized_id];
}
};

async function build_html2(collection, opts = {}) {
const settings_html = Object.entries(collection.settings_config).map(([setting_key, setting_config]) => {
if (!setting_config.setting)
setting_config.setting = setting_key;
return this.render_setting_html(setting_config);
}).join("\n");
const html = `<div class="source-settings">
${settings_header_html(collection, opts)}
${settings_html}
</div>`;
return html;
}
function settings_header_html(collection, opts = {}) {
const heading_text = collection.collection_key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
const heading_html = collection.collection_key === "smart_sources" ? get_source_heading_html(collection) : get_block_heading_html(collection);
return `<div class="group-header">
<h2>${heading_text}</h2>
${heading_html}
</div>`;
}
function get_source_heading_html(collection) {
const item_count = Object.keys(collection.items).length;
if (!collection.loaded) {
return `<span>${item_count} sources (embeddings not currently loaded)</span>`;
}
const total_count = collection.total_files;
const included_count = collection.included_files;
if (collection.loaded !== included_count) {
return `<span>${collection.loaded}/${included_count} sources (partially loaded, should refresh/reload)</span>`;
}
const embedded_items = Object.values(collection.items).filter((item) => item.vec);
const embedded_percentage = Math.round(embedded_items.length / item_count * 100);
const load_time_html = collection.load_time_ms ? `<span>Load time: ${collection.load_time_ms}ms</span>` : "";
return `
<span>${embedded_percentage}% embedded</span>
${embedded_percentage === 0 ? "<span><b>Should run Re-import to re-embed</b></span>" : ""}
<span>${included_count} included</span>
<span>${total_count - included_count} excluded</span>
${load_time_html}
`;
}
function get_block_heading_html(collection) {
const item_count = Object.keys(collection.items).length;
if (!collection.loaded) {
return `<span>${item_count} blocks (embeddings not currently loaded)</span>`;
}
if (collection.loaded !== item_count) {
return `<span>${collection.loaded}/${item_count} (loaded/total)</span>`;
}
const items_w_vec = Object.values(collection.items).filter((item) => item.vec).length;
const embedded_percentage = Math.round(items_w_vec / item_count * 100);
const load_time_html = collection.load_time_ms ? `<span>Load time: ${collection.load_time_ms}ms</span>` : "";
return `
<span>${embedded_percentage}% embedded (${items_w_vec}/${item_count})</span>
<!--<span>Loaded: ${item_count} blocks (expected ${collection.expected_blocks_ct})</span>-->
${load_time_html}
`;
}
async function render5(collection, opts = {}) {
const html = await build_html2.call(this, collection, opts);
const frag = this.create_doc_fragment(html);
return await post_process4.call(this, collection, frag, opts);
}
async function post_process4(collection, frag, opts = {}) {
await this.render_setting_components(frag, { scope: collection });
return frag;
}

async function render6(scope, opts = {}) {
const html = Object.entries(scope.settings_config).map(([setting_key, setting_config]) => {
if (!setting_config.setting)
setting_config.setting = setting_key;
return this.render_setting_html(setting_config);
}).join("\n");
const frag = this.create_doc_fragment(html);
return await post_process5.call(this, scope, frag, opts);
}
async function post_process5(scope, frag, opts = {}) {
await this.render_setting_components(frag, { scope });
return frag;
}

function get_markdown_links2(content) {
const markdown_link_pattern = /\[([^\]]+)\]\(([^)]+)\)/g;
const wikilink_pattern = /\[\[([^\|\]]+)(?:\|([^\]]+))?\]\]/g;
const result = [];
const extract_links_from_pattern = (pattern, type) => {
let match;
while ((match = pattern.exec(content)) !== null) {
const title = type === "markdown" ? match[1] : match[2] || match[1];
const target = type === "markdown" ? match[2] : match[1];
const line = content.substring(0, match.index).split("\n").length;
result.push({ title, target, line });
}
};
extract_links_from_pattern(markdown_link_pattern, "markdown");
extract_links_from_pattern(wikilink_pattern, "wikilink");
result.sort((a, b) => a.line - b.line || a.target.localeCompare(b.target));
return result;
}

function get_line_range2(content, start_line, end_line) {
const lines = content.split("\n");
return lines.slice(start_line - 1, end_line).join("\n");
}

function parse_markdown_blocks2(markdown, opts = {}) {
const { start_index = 1, line_keys = false } = opts;
const lines = markdown.split("\n");
const result = {};
const heading_stack = [];
const heading_lines = {};
const heading_counts = {};
const sub_block_counts = {};
const subheading_counts = {};
let current_list_item = null;
let current_content_block = null;
let in_frontmatter = false;
let frontmatter_started = false;
const root_heading_key = "#";
let in_code_block = false;
sub_block_counts[root_heading_key] = 0;
for (let i = 0; i < lines.length; i++) {
const line_number = i + start_index;
const line = lines[i];
const trimmed_line = line.trim();
if (trimmed_line === "---") {
if (!frontmatter_started) {
frontmatter_started = true;
in_frontmatter = true;
heading_lines["#---frontmatter---"] = [line_number, null];
continue;
} else if (in_frontmatter) {
in_frontmatter = false;
heading_lines["#---frontmatter---"][1] = line_number;
continue;
}
}
if (in_frontmatter) {
continue;
}
if (trimmed_line.startsWith("```")) {
in_code_block = !in_code_block;
if (!current_content_block) {
const parent_key = heading_stack.length > 0 ? heading_stack[heading_stack.length - 1].key : root_heading_key;
if (parent_key === root_heading_key && !heading_lines[root_heading_key]) {
heading_lines[root_heading_key] = [line_number, null];
}
if (parent_key === root_heading_key) {
current_content_block = { key: root_heading_key, start_line: line_number };
if (heading_lines[root_heading_key][1] === null || heading_lines[root_heading_key][1] < line_number) {
heading_lines[root_heading_key][1] = null;
}
} else {
if (sub_block_counts[parent_key] === void 0) {
sub_block_counts[parent_key] = 0;
}
sub_block_counts[parent_key] += 1;
const n = sub_block_counts[parent_key];
const key = `${parent_key}#{${n}}`;
heading_lines[key] = [line_number, null];
current_content_block = { key, start_line: line_number };
}
}
continue;
}
const heading_match = trimmed_line.match(/^(#{1,6})\s*(.+)$/);
if (heading_match && !in_code_block) {
const level = heading_match[1].length;
let title = heading_match[2].trim();
while (heading_stack.length > 0 && heading_stack[heading_stack.length - 1].level >= level) {
const finished_heading = heading_stack.pop();
if (heading_lines[finished_heading.key][1] === null) {
heading_lines[finished_heading.key][1] = line_number - 1;
}
}
if (heading_stack.length === 0 && heading_lines[root_heading_key] && heading_lines[root_heading_key][1] === null) {
heading_lines[root_heading_key][1] = line_number - 1;
}
if (current_content_block) {
if (heading_lines[current_content_block.key][1] === null) {
heading_lines[current_content_block.key][1] = line_number - 1;
}
current_content_block = null;
}
if (current_list_item) {
if (heading_lines[current_list_item.key][1] === null) {
heading_lines[current_list_item.key][1] = line_number - 1;
}
current_list_item = null;
}
let parent_key = "";
let parent_level = 0;
if (heading_stack.length > 0) {
parent_key = heading_stack[heading_stack.length - 1].key;
parent_level = heading_stack[heading_stack.length - 1].level;
} else {
parent_key = "";
parent_level = 0;
}
if (heading_stack.length === 0) {
heading_counts[title] = (heading_counts[title] || 0) + 1;
if (heading_counts[title] > 1) {
title += `[${heading_counts[title]}]`;
}
} else {
if (!subheading_counts[parent_key]) {
subheading_counts[parent_key] = {};
}
subheading_counts[parent_key][title] = (subheading_counts[parent_key][title] || 0) + 1;
const count = subheading_counts[parent_key][title];
if (count > 1) {
title += `#{${count}}`;
}
}
const level_diff = level - parent_level;
const hashes = "#".repeat(level_diff);
const key = parent_key + hashes + title;
heading_lines[key] = [line_number, null];
sub_block_counts[key] = 0;
heading_stack.push({ level, title, key });
continue;
}
const list_match = line.match(/^(\s*)([-*]|\d+\.) (.+)$/);
if (list_match && !in_code_block) {
const indentation = list_match[1].length;
if (indentation === 0) {
if (current_list_item) {
if (heading_lines[current_list_item.key][1] === null) {
heading_lines[current_list_item.key][1] = line_number - 1;
}
current_list_item = null;
}
if (current_content_block && current_content_block.key !== root_heading_key) {
if (heading_lines[current_content_block.key][1] === null) {
heading_lines[current_content_block.key][1] = line_number - 1;
}
current_content_block = null;
}
let parent_key = heading_stack.length > 0 ? heading_stack[heading_stack.length - 1].key : root_heading_key;
if (parent_key === root_heading_key && !heading_lines[root_heading_key]) {
heading_lines[root_heading_key] = [line_number, null];
}
if (sub_block_counts[parent_key] === void 0) {
sub_block_counts[parent_key] = 0;
}
sub_block_counts[parent_key] += 1;
const n = sub_block_counts[parent_key];
let key;
if (line_keys) {
const words = get_longest_words_in_order2(list_match[3], 10);
key = `${parent_key}#${words}`;
} else {
key = `${parent_key}#{${n}}`;
}
heading_lines[key] = [line_number, null];
current_list_item = { key, start_line: line_number };
continue;
}
if (current_list_item) {
continue;
}
}
if (trimmed_line === "") {
continue;
}
if (!current_content_block) {
if (current_list_item) {
if (heading_lines[current_list_item.key][1] === null) {
heading_lines[current_list_item.key][1] = line_number - 1;
}
current_list_item = null;
}
let parent_key = heading_stack.length > 0 ? heading_stack[heading_stack.length - 1].key : root_heading_key;
if (parent_key === root_heading_key) {
if (!heading_lines[root_heading_key]) {
heading_lines[root_heading_key] = [line_number, null];
}
if (heading_lines[root_heading_key][1] === null || heading_lines[root_heading_key][1] < line_number) {
heading_lines[root_heading_key][1] = null;
}
current_content_block = { key: root_heading_key, start_line: line_number };
} else {
if (sub_block_counts[parent_key] === void 0) {
sub_block_counts[parent_key] = 0;
}
sub_block_counts[parent_key] += 1;
const n = sub_block_counts[parent_key];
const key = `${parent_key}#{${n}}`;
heading_lines[key] = [line_number, null];
current_content_block = { key, start_line: line_number };
}
}
}
const total_lines = lines.length;
while (heading_stack.length > 0) {
const finished_heading = heading_stack.pop();
if (heading_lines[finished_heading.key][1] === null) {
heading_lines[finished_heading.key][1] = total_lines + start_index - 1;
}
}
if (current_list_item) {
if (heading_lines[current_list_item.key][1] === null) {
heading_lines[current_list_item.key][1] = total_lines + start_index - 1;
}
current_list_item = null;
}
if (current_content_block) {
if (heading_lines[current_content_block.key][1] === null) {
heading_lines[current_content_block.key][1] = total_lines + start_index - 1;
}
current_content_block = null;
}
if (heading_lines[root_heading_key] && heading_lines[root_heading_key][1] === null) {
heading_lines[root_heading_key][1] = total_lines + start_index - 1;
}
for (const key in heading_lines) {
result[key] = heading_lines[key];
}
return result;
}
function get_longest_words_in_order2(line, n = 3) {
const words = line.split(/\s+/).sort((a, b) => b.length - a.length).slice(0, n);
return words.sort((a, b) => line.indexOf(a) - line.indexOf(b)).join(" ");
}

async function parse_blocks(source, content) {
let blocks_obj = parse_markdown_blocks2(content);
for (const [sub_key, line_range] of Object.entries(blocks_obj)) {
const block_key = source.key + sub_key;
const existing_block = source.block_collection.get(block_key);
const block_content = get_line_range2(content, line_range[0], line_range[1]);
if (existing_block && existing_block.lines[0] === line_range[0] && existing_block.lines[1] === line_range[1] && existing_block.size === block_content.length && existing_block.vec) {
continue;
}
const block_outlinks = get_markdown_links2(block_content);
const block_data = {
key: block_key,
lines: line_range,
size: block_content.length,
outlinks: block_outlinks
};
const new_item = new source.block_collection.item_type(source.env, block_data);
new_item.queue_embed();
source.block_collection.set(new_item);
}
clean_and_update_source_blocks(source, blocks_obj);
}
function clean_and_update_source_blocks(source, blocks_obj) {
const current_block_keys = new Set(Object.keys(blocks_obj).map((sk) => source.key + sk));
const blocks = source.blocks;
for (let i = 0; i < blocks.length; i++) {
if (!current_block_keys.has(blocks[i].key)) {
blocks[i].deleted = true;
blocks[i].queue_save();
}
}
source.data.blocks = blocks_obj;
source.queue_save();
}

var import_obsidian4 = require("obsidian");
var ExcludedFoldersFuzzy = class extends import_obsidian4.FuzzySuggestModal {
/**
* @param {App} app - The Obsidian app
* @param {Object} env - An environment-like object, must have .settings and .fs.folder_paths
*/
constructor(app, env) {
super(app);
this.env = env;
this.setPlaceholder("Select a folder to exclude...");
}
open(callback) {
this.callback = callback;
super.open();
}
getItems() {
return this.env.smart_sources?.fs?.folder_paths || [];
}
getItemText(item) {
return item;
}
onChooseItem(item) {
if (!item)
return;
const oldVal = this.env.settings.folder_exclusions || "";
const splitted = oldVal.split(",").map((s) => s.trim()).filter(Boolean);
if (!splitted.includes(item))
splitted.push(item);
this.env.settings.folder_exclusions = splitted.join(",");
this.callback?.();
}
};

var import_obsidian5 = require("obsidian");
var ExcludedSourcesModal = class extends import_obsidian5.Modal {
/**
* @param {Object} app - Obsidian app
* @param {Object} env - The environment instance
*/
constructor(app, env) {
super(app);
this.env = env;
}
async onOpen() {
this.titleEl.setText("Excluded Sources");
this.contentEl.addClass("excluded-sources-modal");
this.render_excluded_list();
}
async render_excluded_list() {
this.contentEl.empty();
const list_el = this.contentEl.createEl("ul");
const excluded_file_paths = this.env.smart_sources.excluded_file_paths;
console.log(excluded_file_paths);
for (const file_path of excluded_file_paths) {
const li = list_el.createEl("li");
li.setText(file_path);
}
}
};

var import_obsidian6 = require("obsidian");
var EnvStatsModal = class extends import_obsidian6.Modal {
constructor(app, env) {
super(app);
this.env = env;
}
async onOpen() {
this.titleEl.setText("Smart Environment");
const frag = await this.env.render_component("env_stats", this.env);
this.contentEl.appendChild(frag);
}
};

var import_obsidian7 = require("obsidian");
var ExcludedFilesFuzzy = class extends import_obsidian7.FuzzySuggestModal {
/**
* @param {App} app - The Obsidian app
* @param {Object} env - An environment-like object, must have .settings and .fs.file_paths
*/
constructor(app, env) {
super(app);
this.env = env;
this.setPlaceholder("Select a file to exclude...");
}
open(callback) {
this.callback = callback;
super.open();
}
getItems() {
const fileExclusions = (this.env.settings.file_exclusions || "").split(",").map((s) => s.trim()).filter(Boolean);
const candidates = (this.env.smart_sources?.fs?.file_paths || []).filter((path) => !fileExclusions.includes(path));
return candidates;
}
getItemText(item) {
return item;
}
onChooseItem(item) {
if (!item)
return;
const oldVal = this.env.settings.file_exclusions || "";
const splitted = oldVal.split(",").map((s) => s.trim()).filter(Boolean);
if (!splitted.includes(item))
splitted.push(item);
this.env.settings.file_exclusions = splitted.join(",");
this.callback?.();
}
};

var css_sheet = new CSSStyleSheet();
css_sheet.replaceSync(`.sc-env-settings-container {
margin: 1rem 0;
}

.sc-env-settings-header {
display: flex;
align-items: center;
justify-content: space-between;
margin-bottom: 0.5rem;
}

.toggle-env-settings-btn {
cursor: pointer;
}

.smart-env-settings-header {
margin-bottom: 1rem;
}

.excluded-folder-item,
.excluded-file-item {
margin: 0.3rem 0;
}
`);
var env_settings_default = css_sheet;

async function build_html3(env, opts = {}) {
const env_settings_html = Object.entries(env.settings_config).map(([setting_key, setting_config]) => {
if (setting_key === "file_exclusions" || setting_key === "folder_exclusions")
return false;
if (!setting_config.setting)
setting_config.setting = setting_key;
return this.render_setting_html(setting_config);
}).filter(Boolean).join("\n");
const add_excluded_folders_btn = `
<button class="sc-add-excluded-folder-btn" type="button">Add excluded folder</button>
`;
const add_excluded_files_btn = `
<button class="sc-add-excluded-file-btn" type="button">Add excluded file</button>
`;
const excluded_folders_list = `<div class="sc-excluded-folders-list"></div>`;
const excluded_files_list = `<div class="sc-excluded-files-list"></div>`;
return `
<div class="sc-env-settings-container">
<div class="sc-env-settings-header">
<h2>Smart Environment</h2>
<button type="button" class="toggle-env-settings-btn">Show environment settings</button>
</div>
<div class="sc-env-settings-body" style="display: none;">
<div class="smart-env-settings-header" id="smart-env-buttons">
<button class="sc-collection-stats-btn" type="button">Show stats</button>
<button class="smart-env_reload-sources-btn" type="button">Reload sources</button>
<button class="smart-env_clean-up-data-btn" type="button">Clean-up data</button>
<button class="smart-env_clear-sources-data-btn" type="button">Clear sources data</button>
</div>

${env_settings_html}

<div class="smart-env-settings-header">
<h2>Excluded folders</h2>
${add_excluded_folders_btn}
</div>
${excluded_folders_list}

<div class="smart-env-settings-header">
<h2>Excluded files</h2>
${add_excluded_files_btn}
</div>
${excluded_files_list}

<button class="sc-excluded-sources-btn" type="button">Show excluded</button>

<div data-smart-settings="smart_sources"></div>
<div data-smart-settings="smart_blocks"></div>
<p>Notes about embedding models:</p>
<ul>
<li>IMPORTANT: make sure local <code>BGE-micro-v2</code> embedding model works before trying other local models.</li>
<li>API models require an API key and send your notes to third-party servers for processing.</li>
</ul>
</div>
</div>
`;
}
async function render7(env, opts = {}) {
const html = await build_html3.call(this, env, opts);
const frag = this.create_doc_fragment(html);
this.apply_style_sheet(env_settings_default);
await this.render_setting_components(frag, { scope: env });
env.settings_container = frag.querySelector(".sc-env-settings-container");
post_process6.call(this, env, env.settings_container, opts);
return frag;
}
async function post_process6(env, container, opts = {}) {
const heading_btn = container.querySelector(".toggle-env-settings-btn");
const body_el = container.querySelector(".sc-env-settings-body");
if (heading_btn && body_el) {
heading_btn.addEventListener("click", () => {
const is_hidden = body_el.style.display === "none";
body_el.style.display = is_hidden ? "block" : "none";
heading_btn.textContent = is_hidden ? "Hide environment settings" : "Show environment settings";
});
}
const add_folder_btn = container.querySelector(".sc-add-excluded-folder-btn");
if (add_folder_btn) {
add_folder_btn.addEventListener("click", () => {
const fuzzy = new ExcludedFoldersFuzzy(env.main.app, env);
fuzzy.open(() => {
render_excluded_dir_list(env, container);
env.update_exclusions();
});
});
}
const add_file_btn = container.querySelector(".sc-add-excluded-file-btn");
if (add_file_btn) {
add_file_btn.addEventListener("click", () => {
const fuzzy = new ExcludedFilesFuzzy(env.main.app, env);
fuzzy.open(() => {
render_excluded_file_list(env, container);
env.update_exclusions();
});
});
}
const show_excluded_btn = container.querySelector(".sc-excluded-sources-btn");
if (show_excluded_btn) {
show_excluded_btn.addEventListener("click", () => {
const modal = new ExcludedSourcesModal(env.main.app, env);
modal.open();
});
}
const show_stats_btn = container.querySelector(".sc-collection-stats-btn");
if (show_stats_btn) {
show_stats_btn.addEventListener("click", () => {
const modal = new EnvStatsModal(env.main.app, env);
modal.open();
});
}
const reload_sources_btn = container.querySelector(".smart-env_reload-sources-btn");
if (reload_sources_btn) {
reload_sources_btn.addEventListener("click", async () => {
const start = Date.now();
env.smart_sources.unload();
env.smart_blocks.unload();
await env.init_collections();
await env.load_collections();
await env.smart_sources.process_embed_queue();
const end = Date.now();
env.main.notices?.show("reload_sources", { time_ms: end - start });
});
}
const clean_up_data_btn = container.querySelector(".smart-env_clean-up-data-btn");
if (clean_up_data_btn) {
clean_up_data_btn.addEventListener("click", async () => {
await env.smart_sources.run_clean_up_data();
});
}
const smart_env_buttons = container.querySelector("#smart-env-buttons");
const clear_sources_data_btn = smart_env_buttons.querySelector(".smart-env_clear-sources-data-btn");
if (clear_sources_data_btn) {
const inline_confirm_html = `
<div class="sc-inline-confirm-row" style="display: none;">
<span style="margin-right: 10px;">
Are you sure you want to clear all sources data? This cannot be undone.
</span>
<span class="sc-inline-confirm-row-buttons">
<button class="sc-inline-confirm-yes">Yes</button>
<button class="sc-inline-confirm-cancel">Cancel</button>
</span>
</div>
`;
const inline_confirm_frag = this.create_doc_fragment(inline_confirm_html);
smart_env_buttons.appendChild(inline_confirm_frag);
const confirm_yes = smart_env_buttons.querySelector(".sc-inline-confirm-yes");
const confirm_cancel = smart_env_buttons.querySelector(".sc-inline-confirm-cancel");
clear_sources_data_btn.addEventListener("click", () => {
const confirm_row = smart_env_buttons.querySelector(".sc-inline-confirm-row");
confirm_row.style.display = "block";
clear_sources_data_btn.style.display = "none";
});
confirm_yes.addEventListener("click", async (e) => {
const confirm_row = e.target.closest(".sc-inline-confirm-row");
await env.smart_sources.run_clear_all();
confirm_row.style.display = "none";
clear_sources_data_btn.style.display = "inline-block";
});
confirm_cancel.addEventListener("click", (e) => {
const confirm_row = e.target.closest(".sc-inline-confirm-row");
confirm_row.style.display = "none";
clear_sources_data_btn.style.display = "inline-block";
});
}
const env_collections_containers = container.querySelectorAll("[data-smart-settings]");
for (const el of env_collections_containers) {
const collection_key = el.dataset.smartSettings;
const collection = env[collection_key];
if (!collection)
continue;
await collection.render_settings(el);
}
render_excluded_dir_list(env, container);
render_excluded_file_list(env, container);
}
function render_excluded_dir_list(env, container) {
const list_container = container.querySelector(".sc-excluded-folders-list");
if (!list_container)
return;
list_container.empty();
const ul = list_container.createEl("ul");
const excluded_csv = env.settings.folder_exclusions || "";
const arr = excluded_csv.split(",").map((s) => s.trim()).filter(Boolean);
arr.forEach((folder) => {
const li = ul.createEl("li", { cls: "excluded-folder-item" });
li.setText(folder + "  ");
const remove_btn = li.createEl("button", { text: "(x)", cls: "remove-folder-btn" });
remove_btn.addEventListener("click", () => {
const splitted = excluded_csv.split(",").map((x) => x.trim()).filter(Boolean);
const new_arr = splitted.filter((f) => f !== folder);
env.settings.folder_exclusions = new_arr.join(",");
render_excluded_dir_list(env, container);
});
});
if (!arr.length) {
ul.createEl("li", { text: "No folders excluded yet." });
}
}
function render_excluded_file_list(env, container) {
const list_container = container.querySelector(".sc-excluded-files-list");
if (!list_container)
return;
list_container.empty();
const ul = list_container.createEl("ul");
const excluded_csv = env.settings.file_exclusions || "";
const arr = excluded_csv.split(",").map((s) => s.trim()).filter(Boolean);
arr.forEach((file_path) => {
const li = ul.createEl("li", { cls: "excluded-file-item" });
li.setText(file_path + "  ");
const remove_btn = li.createEl("button", { text: "(x)", cls: "remove-file-btn" });
remove_btn.addEventListener("click", () => {
const splitted = excluded_csv.split(",").map((s) => s.trim()).filter(Boolean);
const new_arr = splitted.filter((f) => f !== file_path);
env.settings.file_exclusions = new_arr.join(",");
render_excluded_file_list(env, container);
});
});
if (!arr.length) {
ul.createEl("li", { text: "No files excluded yet." });
}
}

function format_collection_name(key) {
return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

async function build_html4(env, opts = {}) {
const lines = [];
lines.push(`<h2>Collections</h2>`);
const collection_keys = Object.keys(env.collections).sort((a, b) => {
if (a === "smart_sources" || a === "smart_blocks")
return -1;
if (b === "smart_sources" || b === "smart_blocks")
return 1;
return a.localeCompare(b);
});
console.log("collection_keys", collection_keys);
for (const collection_key of collection_keys) {
const collection = env[collection_key];
if (!collection || !collection.items) {
lines.push(`
<div class="sc-collection-stats">
<h3>${format_collection_name(collection_key)}</h3>
<p>No valid items.</p>
</div>
`);
continue;
}
const snippet = generate_collection_stats(collection, collection_key);
lines.push(snippet);
}
return `
<div class="sc-env-stats-container">
${lines.join("\n")}
</div>
`;
}
async function render8(env, opts = {}) {
const html = await build_html4.call(this, env, opts);
const frag = this.create_doc_fragment(html);
return await post_process7.call(this, env, frag, opts);
}
async function post_process7(env, frag, opts = {}) {
return frag;
}
function generate_collection_stats(collection, collectionKey) {
const total_items = Object.values(collection.items).length;
const niceName = format_collection_name(collectionKey);
const state = collection.env.collections[collectionKey];
console.log("state", collectionKey, state);
if (state !== "loaded") {
return `
<div class="sc-collection-stats">
<h3>${niceName}</h3>
<p>Not loaded yet (${total_items} items known).</p>
</div>
`;
}
const load_time_html = collection.load_time_ms ? `<span>Load time: ${collection.load_time_ms}ms</span>` : "";
const state_html = `<span>State: ${state}</span>`;
let html = "";
if (collectionKey === "smart_sources") {
html = get_smart_sources_stats(collection, niceName, total_items);
} else {
html = get_generic_collection_stats(collection, niceName, total_items);
}
let embed_stats = "";
if (typeof collection.process_embed_queue === "function") {
embed_stats = calculate_embed_coverage(collection, total_items);
}
return `
<div class="sc-collection-stats">
<h3>${niceName}</h3>
${embed_stats}
${html}
${load_time_html}
${state_html}
</div>
`;
}
function get_smart_sources_stats(collection, niceName, total_items, load_time_html) {
const totalFiles = collection.total_files ?? total_items;
const included = collection.included_files ?? "Error calculating included files";
const excluded = totalFiles - included;
return `
<p><strong>Total Files:</strong> ${totalFiles}</p>
<p><strong>Excluded:</strong> ${excluded}</p>
<p><strong>Included:</strong> ${included}</p>
`;
}
function get_generic_collection_stats(collection, niceName, total_items, load_time_html) {
return `
<p><strong>Total:</strong> ${total_items}</p>
`;
}
function calculate_embed_coverage(collection, total_items) {
const embedded_items = Object.values(collection.items).filter((item) => item.vec);
if (!embedded_items.length)
return "<p>No items embedded</p>";
const is_unembedded = Object.values(collection.items).filter((i) => i.should_embed && i.is_unembedded);
const pct = embedded_items.length / total_items * 100;
const percent = Math.round(pct);
const display = `${percent}% (${embedded_items.length} / ${total_items})`;
return `<p><strong>Embedding coverage:</strong> ${display}</p>` + (is_unembedded.length ? `<p><strong>Unembedded:</strong> ${is_unembedded.length}</p>` : "");
}

async function build_html5(collection, opts = {}) {
const settings_html = Object.entries(collection.settings_config).map(([setting_key, setting_config]) => {
if (!setting_config.setting)
setting_config.setting = setting_key;
return this.render_setting_html(setting_config);
}).join("\n");
const html = `<div class="source-settings">
<h2>${format_collection_name(collection.collection_key)}</h2>
${settings_html}
</div>`;
return html;
}
async function render9(collection, opts = {}) {
const html = await build_html5.call(this, collection, opts);
const frag = this.create_doc_fragment(html);
return await post_process8.call(this, collection, frag, opts);
}
async function post_process8(collection, frag, opts = {}) {
await this.render_setting_components(frag, { scope: collection });
return frag;
}

var smart_env_config = {
collections: {},
item_types: {},
components: {
env_settings: render7,
env_stats: render8,
smart_sources: {
settings: render9
}
}
};

var smart_env_config2 = {
env_path: "",
modules: {
smart_fs: {
class: SmartFs,
adapter: SmartFsObsidianAdapter
},
smart_view: {
class: SmartView,
adapter: SmartViewObsidianAdapter
},
smart_notices: {
class: SmartNotices,
adapter: import_obsidian10.Notice
}
},
collections: {
smart_sources: {
collection_key: "smart_sources",
class: SmartSources,
data_adapter: AjsonMultiFileSourcesDataAdapter,
source_adapters: {
"md": ObsidianMarkdownSourceContentAdapter,
"txt": ObsidianMarkdownSourceContentAdapter
},
content_parsers: [
parse_blocks
],
process_embed_queue: false
},
smart_blocks: {
collection_key: "smart_blocks",
class: SmartBlocks,
data_adapter: AjsonMultiFileBlocksDataAdapter,
block_adapters: {
"md": MarkdownBlockContentAdapter,
"txt": MarkdownBlockContentAdapter
}
}
},
item_types: {
SmartSource,
SmartBlock
},
items: {
smart_source: smart_source_default,
smart_block: smart_block_default
},
components: {
smart_blocks: {
settings: render5
},
smart_embed_model: {
settings: render6
}
},
default_settings: {
is_obsidian_vault: true,
smart_blocks: {
embed_blocks: true,
min_chars: 200
},
smart_sources: {
min_chars: 200,
embed_model: {
adapter: "transformers",
transformers: {
legacy_transformers: false,
model_key: "TaylorAI/bge-micro-v2"
}
}
},
file_exclusions: "Untitled",
folder_exclusions: "smart-chats",
smart_view_filter: {
render_markdown: true,
show_full_path: false
}
}
};
merge_env_config(smart_env_config2, smart_env_config);
var default_config_default = smart_env_config2;

var SmartEnv2 = class extends SmartEnv {
static async create(plugin, main_env_opts = null) {
if (!main_env_opts)
main_env_opts = plugin.smart_env_config;
if (plugin.app.plugins.plugins["smart-connections"] && plugin.app.plugins.plugins["smart-connections"].env && !plugin.app.plugins.plugins["smart-connections"].env.constructor.version) {
const update_notice = "Detected older SmartEnv with 'init_main'. Reloading without the outdated plugin. Please update Smart Connections.";
console.warn(update_notice);
new import_obsidian11.Notice(update_notice, 0);
disable_plugin(plugin.app, "smart-connections");
}
const opts = merge_env_config(main_env_opts, default_config_default);
return await super.create(plugin, opts);
}
manual_load() {
this.manual_load = true;
}
async load() {
if (import_obsidian11.Platform.isMobile && !this.manual_load) {
this.notices.show("load_env");
return;
}
await super.load();
const plugin = this.main;
plugin.registerEvent(
plugin.app.vault.on("create", (file) => {
if (file instanceof import_obsidian11.TFile && this.smart_sources?.source_adapters?.[file.extension]) {
const source = this.smart_sources?.init_file_path(file.path);
if (source)
this.smart_sources?.fs.include_file(file.path);
}
})
);
plugin.registerEvent(
plugin.app.vault.on("rename", (file, old_path) => {
if (file instanceof import_obsidian11.TFile && this.smart_sources?.source_adapters?.[file.extension]) {
const source = this.smart_sources?.init_file_path(file.path);
if (source)
this.smart_sources?.fs.include_file(file.path);
}
if (old_path) {
const source = this.smart_sources?.get(old_path);
if (source) {
source.delete();
if (this.rename_debounce_timeout)
clearTimeout(this.rename_debounce_timeout);
this.rename_debounce_timeout = setTimeout(() => {
this.smart_sources?.process_save_queue();
this.rename_debounce_timeout = null;
}, 1e3);
}
}
})
);
plugin.registerEvent(
plugin.app.vault.on("modify", (file) => {
if (file instanceof import_obsidian11.TFile && this.smart_sources?.source_adapters?.[file.extension]) {
const source = this.smart_sources?.get(file.path);
if (source) {
if (!this.sources_import_timeouts)
this.sources_import_timeouts = {};
if (this.sources_import_timeouts[file.path])
clearTimeout(this.sources_import_timeouts[file.path]);
this.sources_import_timeouts[file.path] = setTimeout(() => {
source.import();
}, 23e3);
}
}
})
);
plugin.registerEvent(
plugin.app.vault.on("delete", (file) => {
if (file instanceof import_obsidian11.TFile && this.smart_sources?.source_adapters?.[file.extension]) {
delete this.smart_sources?.items[file.path];
}
})
);
}
};
async function disable_plugin(app, plugin_id) {
console.log("disabling plugin", plugin_id);
await app.plugins.unloadPlugin(plugin_id);
await app.plugins.disablePluginAndSave(plugin_id);
await app.plugins.loadManifests();
}

async function create_hash3(text) {
if (text.length > 1e5)
text = text.substring(0, 1e5);
const msgUint8 = new TextEncoder().encode(text.trim());
const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
const hashArray = Array.from(new Uint8Array(hashBuffer));
const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
return hashHex;
}

var SourceContentAdapter2 = class {
constructor(item) {
this.item = item;
}
async import() {
this.throw_not_implemented("import");
}
async create() {
this.throw_not_implemented("create");
}
async update() {
this.throw_not_implemented("update");
}
async read() {
this.throw_not_implemented("read");
}
async remove() {
this.throw_not_implemented("remove");
}
get data() {
return this.item.data;
}
async create_hash(content) {
return await create_hash3(content);
}
get settings() {
return this.item.env.settings.smart_sources[this.adapter_key];
}
get adapter_key() {
return to_snake2(this.constructor.name);
}
static get adapter_key() {
return to_snake2(this.name);
}
get fs() {
return this.item.collection.fs;
}
get env() {
return this.item.env;
}
};
function to_snake2(str) {
return str[0].toLowerCase() + str.slice(1).replace(/([A-Z])/g, "_$1").toLowerCase();
}

function parse_markdown_blocks3(markdown, opts = {}) {
const { start_index = 1, line_keys = false } = opts;
const lines = markdown.split("\n");
const result = {};
const heading_stack = [];
const heading_lines = {};
const heading_counts = {};
const sub_block_counts = {};
const subheading_counts = {};
let current_list_item = null;
let current_content_block = null;
let in_frontmatter = false;
let frontmatter_started = false;
const root_heading_key = "#";
let in_code_block = false;
sub_block_counts[root_heading_key] = 0;
for (let i = 0; i < lines.length; i++) {
const line_number = i + start_index;
const line = lines[i];
const trimmed_line = line.trim();
if (trimmed_line === "---") {
if (!frontmatter_started) {
frontmatter_started = true;
in_frontmatter = true;
heading_lines["#---frontmatter---"] = [line_number, null];
continue;
} else if (in_frontmatter) {
in_frontmatter = false;
heading_lines["#---frontmatter---"][1] = line_number;
continue;
}
}
if (in_frontmatter) {
continue;
}
if (trimmed_line.startsWith("```")) {
in_code_block = !in_code_block;
if (!current_content_block) {
const parent_key = heading_stack.length > 0 ? heading_stack[heading_stack.length - 1].key : root_heading_key;
if (parent_key === root_heading_key && !heading_lines[root_heading_key]) {
heading_lines[root_heading_key] = [line_number, null];
}
if (parent_key === root_heading_key) {
current_content_block = { key: root_heading_key, start_line: line_number };
if (heading_lines[root_heading_key][1] === null || heading_lines[root_heading_key][1] < line_number) {
heading_lines[root_heading_key][1] = null;
}
} else {
if (sub_block_counts[parent_key] === void 0) {
sub_block_counts[parent_key] = 0;
}
sub_block_counts[parent_key] += 1;
const n = sub_block_counts[parent_key];
const key = `${parent_key}#{${n}}`;
heading_lines[key] = [line_number, null];
current_content_block = { key, start_line: line_number };
}
}
continue;
}
const heading_match = trimmed_line.match(/^(#{1,6})\s*(.+)$/);
if (heading_match && !in_code_block) {
const level = heading_match[1].length;
let title = heading_match[2].trim();
while (heading_stack.length > 0 && heading_stack[heading_stack.length - 1].level >= level) {
const finished_heading = heading_stack.pop();
if (heading_lines[finished_heading.key][1] === null) {
heading_lines[finished_heading.key][1] = line_number - 1;
}
}
if (heading_stack.length === 0 && heading_lines[root_heading_key] && heading_lines[root_heading_key][1] === null) {
heading_lines[root_heading_key][1] = line_number - 1;
}
if (current_content_block) {
if (heading_lines[current_content_block.key][1] === null) {
heading_lines[current_content_block.key][1] = line_number - 1;
}
current_content_block = null;
}
if (current_list_item) {
if (heading_lines[current_list_item.key][1] === null) {
heading_lines[current_list_item.key][1] = line_number - 1;
}
current_list_item = null;
}
let parent_key = "";
let parent_level = 0;
if (heading_stack.length > 0) {
parent_key = heading_stack[heading_stack.length - 1].key;
parent_level = heading_stack[heading_stack.length - 1].level;
} else {
parent_key = "";
parent_level = 0;
}
if (heading_stack.length === 0) {
heading_counts[title] = (heading_counts[title] || 0) + 1;
if (heading_counts[title] > 1) {
title += `[${heading_counts[title]}]`;
}
} else {
if (!subheading_counts[parent_key]) {
subheading_counts[parent_key] = {};
}
subheading_counts[parent_key][title] = (subheading_counts[parent_key][title] || 0) + 1;
const count = subheading_counts[parent_key][title];
if (count > 1) {
title += `#{${count}}`;
}
}
const level_diff = level - parent_level;
const hashes = "#".repeat(level_diff);
const key = parent_key + hashes + title;
heading_lines[key] = [line_number, null];
sub_block_counts[key] = 0;
heading_stack.push({ level, title, key });
continue;
}
const list_match = line.match(/^(\s*)([-*]|\d+\.) (.+)$/);
if (list_match && !in_code_block) {
const indentation = list_match[1].length;
if (indentation === 0) {
if (current_list_item) {
if (heading_lines[current_list_item.key][1] === null) {
heading_lines[current_list_item.key][1] = line_number - 1;
}
current_list_item = null;
}
if (current_content_block && current_content_block.key !== root_heading_key) {
if (heading_lines[current_content_block.key][1] === null) {
heading_lines[current_content_block.key][1] = line_number - 1;
}
current_content_block = null;
}
let parent_key = heading_stack.length > 0 ? heading_stack[heading_stack.length - 1].key : root_heading_key;
if (parent_key === root_heading_key && !heading_lines[root_heading_key]) {
heading_lines[root_heading_key] = [line_number, null];
}
if (sub_block_counts[parent_key] === void 0) {
sub_block_counts[parent_key] = 0;
}
sub_block_counts[parent_key] += 1;
const n = sub_block_counts[parent_key];
let key;
if (line_keys) {
const words = get_longest_words_in_order3(list_match[3], 10);
key = `${parent_key}#${words}`;
} else {
key = `${parent_key}#{${n}}`;
}
heading_lines[key] = [line_number, null];
current_list_item = { key, start_line: line_number };
continue;
}
if (current_list_item) {
continue;
}
}
if (trimmed_line === "") {
continue;
}
if (!current_content_block) {
if (current_list_item) {
if (heading_lines[current_list_item.key][1] === null) {
heading_lines[current_list_item.key][1] = line_number - 1;
}
current_list_item = null;
}
let parent_key = heading_stack.length > 0 ? heading_stack[heading_stack.length - 1].key : root_heading_key;
if (parent_key === root_heading_key) {
if (!heading_lines[root_heading_key]) {
heading_lines[root_heading_key] = [line_number, null];
}
if (heading_lines[root_heading_key][1] === null || heading_lines[root_heading_key][1] < line_number) {
heading_lines[root_heading_key][1] = null;
}
current_content_block = { key: root_heading_key, start_line: line_number };
} else {
if (sub_block_counts[parent_key] === void 0) {
sub_block_counts[parent_key] = 0;
}
sub_block_counts[parent_key] += 1;
const n = sub_block_counts[parent_key];
const key = `${parent_key}#{${n}}`;
heading_lines[key] = [line_number, null];
current_content_block = { key, start_line: line_number };
}
}
}
const total_lines = lines.length;
while (heading_stack.length > 0) {
const finished_heading = heading_stack.pop();
if (heading_lines[finished_heading.key][1] === null) {
heading_lines[finished_heading.key][1] = total_lines + start_index - 1;
}
}
if (current_list_item) {
if (heading_lines[current_list_item.key][1] === null) {
heading_lines[current_list_item.key][1] = total_lines + start_index - 1;
}
current_list_item = null;
}
if (current_content_block) {
if (heading_lines[current_content_block.key][1] === null) {
heading_lines[current_content_block.key][1] = total_lines + start_index - 1;
}
current_content_block = null;
}
if (heading_lines[root_heading_key] && heading_lines[root_heading_key][1] === null) {
heading_lines[root_heading_key][1] = total_lines + start_index - 1;
}
for (const key in heading_lines) {
result[key] = heading_lines[key];
}
return result;
}
function get_longest_words_in_order3(line, n = 3) {
const words = line.split(/\s+/).sort((a, b) => b.length - a.length).slice(0, n);
return words.sort((a, b) => line.indexOf(a) - line.indexOf(b)).join(" ");
}

var FileSourceContentAdapter2 = class extends SourceContentAdapter2 {
static async init_items(collection) {
if (collection.fs_items_initialized)
return;
collection._fs = null;
await collection.fs.init();
for (const file of Object.values(collection.fs.files)) {
const item = collection.init_file_path(file.path);
if (item)
item.init_file_mtime = file.stat.mtime;
}
collection.fs_items_initialized = Date.now();
}
/**
* @name fs
* @type {Object}
* @readonly
* @description
* Access the file system interface used by this adapter. Typically derived
* from `this.item.collection.fs`.
*/
get fs() {
return this.item.collection.fs;
}
/**
* @name file_path
* @type {string}
* @readonly
* @description
* The file path on disk corresponding to the source. Used for read/write operations.
*/
get file_path() {
return this.item.file_path;
}
/**
* @async
* @method create
* @param {string|null} [content=null] Initial content for the new file.
* @description
* Create a new file on disk. If content is not provided, attempts to use
* `this.item.data.content` as fallback.
*/
async create(content = null) {
if (!content)
content = this.item.data.content || "";
await this.fs.write(this.file_path, content);
}
/**
* @async
* @method update
* @param {string} content The full new content to write to the file.
* @description
* Overwrite the entire file content on disk.
*/
async update(content) {
await this.fs.write(this.file_path, content);
}
/**
* @async
* @method read
* @returns {Promise<string>} The content of the file.
* @description
* Read the file content from disk. Updates `last_read` hash and timestamp on the entity’s data.
* If file is large or special handling is needed, override this method.
*/
async read() {
const content = await this.fs.read(this.file_path);
this.data.last_read = {
hash: await this.create_hash(content || ""),
at: Date.now()
};
return content;
}
/**
* @async
* @method remove
* @returns {Promise<void>}
* @description
* Delete the file from disk. After removal, the source item should also be deleted or updated accordingly.
*/
async remove() {
await this.fs.remove(this.file_path);
}
async move_to(move_to_ref) {
if (!move_to_ref) {
throw new Error("Invalid entity reference for move_to operation");
}
const move_content = await this.read();
let has_existing = false;
if (typeof move_to_ref === "string") {
const existing = this.item.collection.get(move_to_ref);
if (existing) {
move_to_ref = existing;
has_existing = true;
}
} else {
has_existing = true;
}
if (has_existing) {
await move_to_ref.append(move_content);
} else {
move_to_ref = await this.item.collection.create(move_to_ref, move_content);
}
if (this.item.key !== move_to_ref.key) {
await this.remove();
this.item.delete();
} else {
console.log(`did not delete ${this.item.key} because it was moved to ${move_to_ref.key}`);
}
return move_to_ref;
}
/**
* TRANSFERRED FROM markdown.js (2024-12-13)
* TODO NEEDS REVIEW/REFACTOR
*/
async move_to_v1(entity_ref) {
const new_path = typeof entity_ref === "string" ? entity_ref : entity_ref.key;
if (!new_path) {
throw new Error("Invalid entity reference for move_to operation");
}
const current_content = await this.read();
const [target_source_key, ...headings] = new_path.split("#");
const target_source = this.item.collection.get(target_source_key);
if (headings.length > 0) {
const new_headings_content = this.construct_headings(headings);
const new_content = `${new_headings_content}
${current_content}`;
await this._update(new_content);
}
if (target_source) {
await this.merge(current_content, { mode: "append_blocks" });
} else {
await this.rename_and_import(target_source_key, current_content);
}
if (this.item.key !== target_source_key)
await this.remove();
}
construct_headings(headings) {
return headings.map((heading, i) => `${"#".repeat(i + 1)} ${heading}`).join("\n");
}
async rename_and_import(target_source_key, content) {
await this.fs.rename(this.file_path, target_source_key);
const new_source = await this.item.collection.create_or_update({ path: target_source_key, content });
await new_source.import();
}
/**
* Merge content into the source
* @param {string} content - The content to merge into the source
* @param {Object} opts - Options for the merge operation
* @param {string} opts.mode - The mode to use for the merge operation. Defaults to 'append_blocks' (may also be 'replace_blocks')
*/
async merge(content, opts = {}) {
const { mode = "append_blocks" } = opts;
const blocks_obj = parse_markdown_blocks3(content);
if (typeof blocks_obj !== "object" || Array.isArray(blocks_obj)) {
console.warn("merge error: Expected an object from parse_markdown_blocks, but received:", blocks_obj);
throw new Error("merge error: parse_markdown_blocks did not return an object as expected.");
}
const { new_blocks, new_with_parent_blocks, changed_blocks, same_blocks } = await this.get_changes(blocks_obj, content);
for (const block of new_blocks) {
await this.append(block.content);
}
for (const block of new_with_parent_blocks) {
const parent_block = this.item.block_collection.get(block.parent_key);
await parent_block.append(block.content);
}
for (const block of changed_blocks) {
const changed_block = this.item.block_collection.get(block.key);
if (mode === "replace_blocks") {
await changed_block.update(block.content);
} else {
await changed_block.append(block.content);
}
}
}
async get_changes(blocks_obj, content) {
const new_blocks = [];
const new_with_parent_blocks = [];
const changed_blocks = [];
const same_blocks = [];
const existing_blocks = this.source.data.blocks || {};
for (const [sub_key, line_range] of Object.entries(blocks_obj)) {
const has_existing = !!existing_blocks[sub_key];
const block_key = `${this.source.key}${sub_key}`;
const block_content = get_line_range(content, line_range[0], line_range[1]);
if (!has_existing) {
new_blocks.push({
key: block_key,
state: "new",
content: block_content
});
continue;
}
let has_parent;
let headings = sub_key.split("#");
let parent_key;
while (!has_parent && headings.length > 0) {
headings.pop();
parent_key = headings.join("#");
has_parent = !!existing_blocks[parent_key];
}
if (has_parent) {
new_with_parent_blocks.push({
key: block_key,
parent_key: `${this.source.key}${parent_key}`,
state: "new",
content: block_content
});
continue;
}
const block = this.item.block_collection.get(block_key);
const content_hash = await this.create_hash(block_content);
if (content_hash !== block.last_read?.hash) {
changed_blocks.push({
key: block_key,
state: "changed",
content: block_content
});
continue;
}
same_blocks.push({
key: block_key,
state: "same",
content: block_content
});
}
return {
new_blocks,
new_with_parent_blocks,
changed_blocks,
same_blocks
};
}
/**
* Append new content to the source file, placing it at the end of the file.
* @async
* @param {string} content - The content to append.
* @returns {Promise<void>}
*/
async append(content) {
const current_content = await this.read();
const new_content = [
current_content,
"",
content
].join("\n").trim();
await this.update(new_content);
}
};

function get_markdown_links3(content) {
const markdown_link_pattern = /\[([^\]]+)\]\(([^)]+)\)/g;
const wikilink_pattern = /\[\[([^\|\]]+)(?:\|([^\]]+))?\]\]/g;
const result = [];
const extract_links_from_pattern = (pattern, type) => {
let match;
while ((match = pattern.exec(content)) !== null) {
const title = type === "markdown" ? match[1] : match[2] || match[1];
const target = type === "markdown" ? match[2] : match[1];
const line = content.substring(0, match.index).split("\n").length;
result.push({ title, target, line });
}
};
extract_links_from_pattern(markdown_link_pattern, "markdown");
extract_links_from_pattern(wikilink_pattern, "wikilink");
result.sort((a, b) => a.line - b.line || a.target.localeCompare(b.target));
return result;
}

async function parse_links2(source, content) {
if (!source.source_adapter?.get_links)
return;
const outlinks = await source.source_adapter.get_links(content);
source.data.outlinks = outlinks;
}

async function parse_metadata2(source, content) {
if (!source.source_adapter?.get_metadata)
return;
const metadata = await source.source_adapter?.get_metadata?.(content);
source.data.metadata = metadata;
}

function parse_value2(raw_value) {
const trimmed = raw_value.trim();
if (trimmed.startsWith('"') && trimmed.endsWith('"') || trimmed.startsWith("'") && trimmed.endsWith("'")) {
return trimmed.slice(1, -1);
}
const lower = trimmed.toLowerCase();
if (lower === "true")
return true;
if (lower === "false")
return false;
if (!isNaN(trimmed) && trimmed !== "") {
return Number(trimmed);
}
return trimmed;
}
function parse_yaml_block2(yaml_block) {
const lines = yaml_block.split(/\r?\n/);
const data = {};
let i = 0;
while (i < lines.length) {
const line = lines[i];
i++;
if (!line.trim() || line.trim().startsWith("#")) {
continue;
}
const match = line.match(/^([^:]+)\s*:\s*(.*)$/);
if (!match) {
continue;
}
const key = match[1].trim();
let value = match[2].trim();
if (value === ">" || value === "|") {
const multiline_lines = [];
while (i < lines.length) {
const next_line = lines[i];
if (!/^\s+/.test(next_line) || next_line.trim().startsWith("#")) {
break;
}
multiline_lines.push(next_line.replace(/^\s+/, ""));
i++;
}
const joined = multiline_lines.join("\n");
data[key] = parse_value2(joined);
} else if (value === "") {
const arr = [];
let array_consumed = false;
while (i < lines.length) {
const next_line = lines[i];
if (!next_line.trim().startsWith("- ")) {
break;
}
const item_value = next_line.trim().slice(2);
arr.push(parse_value2(item_value));
i++;
array_consumed = true;
}
if (array_consumed) {
data[key] = arr;
} else {
data[key] = "";
}
} else {
data[key] = parse_value2(value);
}
}
return data;
}
function parse_frontmatter2(content) {
if (!content.startsWith("---")) {
return { frontmatter: {}, body: content };
}
const lines = content.split(/\r?\n/);
let end_index = -1;
for (let i = 1; i < lines.length; i++) {
if (lines[i].trim() === "---") {
end_index = i;
break;
}
}
if (end_index === -1) {
return { frontmatter: {}, body: content };
}
const frontmatter_lines = lines.slice(1, end_index);
const frontmatter_block = frontmatter_lines.join("\n");
const frontmatter = parse_yaml_block2(frontmatter_block);
const body_lines = lines.slice(end_index + 1);
const body = body_lines.join("\n");
return { frontmatter, body };
}

var MarkdownSourceContentAdapter2 = class extends FileSourceContentAdapter2 {
static extensions = ["md", "txt"];
/**
* Import the source file content, parse blocks and links, and update `item.data`.
* @async
* @returns {Promise<void>}
*/
async import() {
if (!this.can_import)
return;
if (!this.outdated) {
this.item.blocks.forEach((block) => {
if (!block.vec)
block.queue_embed();
});
return;
}
const content = await this.read();
if (!content) {
return;
}
if (!this.item.vec) {
this.item.data.last_import = null;
}
if (this.data.last_import?.hash === this.data.last_read?.hash) {
if (this.data.blocks)
return;
}
this.data.blocks = null;
await this.parse_content(content);
await this.item.parse_content(content);
const { mtime, size } = this.item.file.stat;
this.data.last_import = {
mtime,
size,
at: Date.now(),
hash: this.data.last_read.hash
};
this.item.loaded_at = Date.now();
this.item.queue_save();
this.item.queue_embed();
}
async parse_content(content) {
await parse_links2(this.item, content);
await parse_metadata2(this.item, content);
}
async get_links(content = null) {
if (!content)
content = await this.read();
if (!content)
return;
return get_markdown_links3(content);
}
async get_metadata(content = null) {
if (!content)
content = await this.read();
if (!content)
return;
const { frontmatter } = parse_frontmatter2(content);
return frontmatter;
}
get can_import() {
if (!this.item.file) {
console.warn(`MarkdownSourceContentAdapter: Skipping missing-file: ${this.file_path}`);
return false;
}
if (this.item.file_type !== "md") {
return false;
}
if (this.item.size > 1e6) {
return false;
}
return true;
}
/**
* @deprecated use outdated instead
*/
get should_import() {
return this.outdated;
}
get outdated() {
try {
if (!this.data.last_import) {
if (this.data.mtime && this.data.size && this.data.hash) {
this.data.last_import = {
mtime: this.data.mtime,
size: this.data.size,
at: Date.now(),
hash: this.data.hash
};
delete this.data.mtime;
delete this.data.size;
delete this.data.hash;
} else {
return true;
}
}
if (this.data.last_read.at > this.data.last_import.at) {
if (this.data.last_import?.hash !== this.data.last_read?.hash)
return true;
}
if (this.data.last_import.mtime < this.item.mtime) {
if (!this.data.last_import.size)
return true;
const size_diff = Math.abs(this.data.last_import.size - this.item.size);
const size_diff_ratio = size_diff / (this.data.last_import.size || 1);
if (size_diff_ratio > 0.01)
return true;
}
return false;
} catch (e) {
console.warn(`MarkdownSourceContentAdapter: error getting should_import for ${this.file_path}: ${e}`);
return true;
}
}
};

var VisionSourceAdapter = class extends MarkdownSourceContentAdapter2 {
static extensions = ["png", "jpg", "jpeg"];
/**
* Adds 'prompt' to the settings config
*/
get settings_config() {
return {
prompt: {
type: "text",
name: "Vision Prompt",
description: "Prompt for LLM-based extraction of images/PDFs"
}
};
}
get chat_model() {
return this.env.smart_sources_plugin.chat_model;
}
get is_media() {
return true;
}
get can_import() {
return true;
}
/**
* Reads the content from the source. If `data.content` is present, returns it.
* Else, tries to orchestrate a `smart-completions` item for LLM-based extraction.
*
* @param {object} opts
* @returns {Promise<string>}
*/
async read(opts = {}) {
if (this.data.content) {
return this.data.content;
}
const completions = this.item.env?.smart_completions;
if (!completions) {
const fallback = await super.read(opts);
return fallback || "";
}
const completion_key = `source_vision-${this.item.key}`;
let comp_item = completions.get(completion_key);
if (!comp_item) {
comp_item = new completions.item_type(this.item.env, {
key: completion_key,
source_vision: {
source_key: this.item.key
}
});
comp_item.chat_model = this.chat_model;
completions.set(comp_item);
await comp_item.init();
comp_item.queue_save();
} else {
const text = comp_item.response_text;
if (text && text.length > 0) {
this.data.content = text;
this.item.queue_save();
return text;
} else {
}
}
return "";
}
};

function insert_user_message(request, user_message, opts = {}) {
if (!user_message)
return;
const { position = "end" } = opts;
if (!request.messages) {
request.messages = [];
}
const last_user_index = request.messages.findLastIndex((x) => x.role === "user");
if (last_user_index === -1) {
const new_user_message = {
role: "user",
content: [{ type: "text", text: user_message }]
};
request.messages.push(new_user_message);
return;
}
const last_user_message = request.messages[last_user_index];
if (!Array.isArray(last_user_message.content)) {
last_user_message.content = [
{
type: "text",
text: last_user_message.content
}
];
}
if (position === "start") {
last_user_message.content.unshift({
type: "text",
text: user_message
});
} else {
last_user_message.content.push({
type: "text",
text: user_message
});
}
}

var SmartCompletionAdapter = class {
constructor(item) {
this.item = item;
}
get data() {
return this.item.data;
}
get completion() {
return this.data.completion;
}
get request() {
return this.item.data.completion.request;
}
get response() {
return this.item.response;
}
insert_user_message(user_message) {
insert_user_message(this.request, user_message);
}
static get property_name() {
return null;
}
/**
* @returns {Promise<void>}
*/
async to_request() {
}
/**
* @returns {Promise<void>}
*/
async from_response() {
}
};

async function insert_image(request, image_path, fs) {
const base64_image = await convert_image_to_base64(fs, image_path);
console.log("base64_image", base64_image);
if (!base64_image)
return;
const last_user_index = request.messages.findLastIndex((x) => x.role === "user");
const image_content = {
role: "user",
content: [{ type: "image_url", image_url: { url: base64_image } }]
};
if (last_user_index === -1) {
request.messages.unshift(image_content);
}
const last_user_message = request.messages[last_user_index];
if (!last_user_message)
return console.warn("insert_image: no last_user_message");
if (!Array.isArray(last_user_message.content)) {
last_user_message.content = [];
}
last_user_message.content.push(image_content.content[0]);
}
async function convert_image_to_base64(fs, image_path) {
console.log("convert image_path", image_path);
if (!image_path)
return;
const image_exts = ["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp", "ico"];
const ext = image_path.split(".").pop().toLowerCase();
if (!image_exts.includes(ext))
return;
try {
const base64_data = await fs.read(image_path, "base64");
const base64_url = `data:image/${ext};base64,${base64_data}`;
return base64_url;
} catch (err) {
console.warn(`Failed to convert image ${image_path} to base64`, err);
}
}

var SourceVisionCompletionAdapter = class extends SmartCompletionAdapter {
static get property_name() {
return "source_vision";
}
async to_request() {
console.log("SourceVisionCompletionAdapter: to_request");
const { source_key } = this.data.source_vision || {};
if (!source_key)
return console.warn("SourceVisionAdapter: no source_key found");
const source = this.item.env.smart_sources?.get(source_key);
if (!source)
return console.warn(`SourceVisionAdapter: no source found for key=${source_key}`);
this.insert_user_message(`Well-described visual content of the image.`);
await insert_image(this.request, source.path, this.item.env.fs);
console.log("SourceVisionCompletionAdapter: to_request: inserted image", this.request);
}
async from_response() {
console.log("SourceVisionCompletionAdapter: from_response");
this.request.messages.forEach((msg) => {
if (Array.isArray(msg.content)) {
msg.content.forEach((content) => {
if (content.type === "image_url") {
content.image_url = null;
}
});
}
});
const text = this.item.response_text;
console.log("SourceVisionAdapter: text", text);
if (!text)
return console.warn("SourceVisionAdapter: no text found");
const source_key = this.data.source_vision?.source_key;
if (!source_key)
return console.warn("SourceVisionAdapter: no source_key found");
const source = this.item.env.smart_sources?.get(source_key);
if (!source)
return console.warn(`SourceVisionAdapter: no source found for key=${source_key}`);
source.data.content = text;
source.queue_save();
}
};

var import_obsidian13 = require("obsidian");
var SmartSourcesSettingTab = class extends import_obsidian13.PluginSettingTab {
/**
* @param {import('obsidian').App} app - The current Obsidian app instance
* @param {import('./main.js').default} plugin - The main plugin object
*/
constructor(app, plugin) {
super(app, plugin);
this.plugin = plugin;
this.plugin.env.create_env_getter(this);
}
/**
* Called by Obsidian to render the settings page.
*/
display() {
this.containerEl.empty();
this.containerEl.createEl("div", {
cls: "smart-vision-settings-container"
});
this.env.smart_view.render_settings(this.plugin.vision_source_adapter.settings_config, {
scope: this.plugin.vision_source_adapter
}).then((frag) => {
const vision_settings_container = this.containerEl.querySelector(".smart-vision-settings-container");
vision_settings_container.empty();
vision_settings_container.appendChild(frag);
});
this.containerEl.createEl("div", {
cls: "smart-vision-chat-model-settings-container"
});
const smart_chat_model_settings_config = this.plugin.chat_model?.settings_config;
this.env.smart_view.render_settings(smart_chat_model_settings_config, {
scope: this.plugin.chat_model
}).then((frag) => {
const chat_model_settings_container = this.containerEl.querySelector(".smart-vision-chat-model-settings-container");
chat_model_settings_container.empty();
chat_model_settings_container.appendChild(frag);
});
this.containerEl.createEl("div", {
cls: "smart-chat-env-settings-container"
});
this.env.render_component("env_settings", this.env).then((frag) => {
const settings_container = this.containerEl.querySelector(".smart-chat-env-settings-container");
settings_container.empty();
settings_container.appendChild(frag);
});
}
};

var SmartSourcesPlugin = class extends import_obsidian14.Plugin {
/**
* Example environment config. Adjust to your needs.
* @type {Object}
*/
smart_env_config = {
collections: {
smart_sources: {
source_adapters: {
VisionSourceAdapter
}
},
smart_completions: {
completion_adapters: {
SourceVisionCompletionAdapter
}
}
},
items: {},
modules: {},
default_settings: {
smart_sources_plugin: {},
smart_sources: {
vision_source_adapter: {
chat_model: {
adapter: "openai",
openai: {
model: "gpt-4.1-nano"
}
}
}
}
}
};
onload() {
SmartEnv2.create(this, {
collections: {},
item_types: {},
modules: {},
...this.smart_env_config
});
this.app.workspace.onLayoutReady(this.initialize.bind(this));
}
async initialize() {
console.log("Loading Smart Sources plugin...");
await SmartEnv2.wait_for({ loaded: true });
this.addSettingTab(new SmartSourcesSettingTab(this.app, this));
}
onunload() {
console.log("Unloading Smart Sources plugin...");
this.env?.unload_main?.(this);
}
get vision_source_adapter() {
return new VisionSourceAdapter({
env: this.env
});
}
get chat_model() {
return this.env.init_module("smart_chat_model", {
model_config: {},
settings: this.env.settings.smart_sources.vision_source_adapter.chat_model,
reload_model: this.open_settings?.bind(this),
re_render_settings: this.open_settings?.bind(this)
});
}
async open_settings() {
console.log("Smart Sources: Opening settings");
await this.app.setting.open();
await this.app.setting.openTabById("smart-sources");
}
};
