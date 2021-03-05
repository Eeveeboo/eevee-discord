import EventEmitter from "events";
import EeveeCore, { DiscordRawPayload, DiscordReadyPayload_1 } from "..";

export class Feature extends EventEmitter {
  /**
   * The core client connected to the discord gateway
   *
   * @type {EeveeCore}
   * @memberof Feature
   */
  readonly client: EeveeCore;
  /**
   * The ready promise which can be awaited on if another featureset requires this one.
   *
   * @type {Promise<void>}
   * @memberof Feature
   */
  // @ts-ignore
  readonly ready: Promise<void>;
  readonly is_ready: boolean = false;
  /**
   * You are required to set this
   *
   * @type {string}
   * @memberof Feature
   */
  readonly name: string = "";
  readonly requires: string[] = [];
  private set_ready: () => void = () => {};
  private set_unready: (force?: boolean) => void = (force) => {
    if (this.is_ready) {
      (<any>this).is_ready = false;
      (<any>this).ready = new Promise<void>((done) => {
        this.set_ready = () => {
          if (!this.is_ready) {
            (<any>this).is_ready = true;
            done();
          }
        };
      });
    }
  };
  constructor(client: EeveeCore) {
    super();
    this.client = client;
    this.set_unready(true);
  }
  private _ready_init = async (p1: DiscordReadyPayload_1) => {
    if (this.ready_init) await this.ready_init(p1);
    this.set_ready();
  };
  async ready_init(p1: DiscordReadyPayload_1): Promise<void> {}
  async handle_raw(p: DiscordRawPayload): Promise<void> {}
  send_raw = (p: DiscordRawPayload) => {
    this.client._send_raw(p);
  };
}
