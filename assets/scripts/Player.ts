
import { _decorator, Component, Node, macro, RigidBody2D, Vec2, Collider2D, Contact2DType, PhysicsSystem2D } from 'cc';
const { ccclass, property } = _decorator;

import { AxInput } from './AxInput';
const Input = AxInput.instance;

@ccclass('Player')
export class Player extends Component {
    private can_jump = true;

    onLoad() {
        PhysicsSystem2D.instance.gravity = new Vec2(0, -600);

        let colliders = this.getComponents(Collider2D);

        for (let collider of colliders) {
            if (collider.tag == 1 || collider.tag == 2) {
                collider?.on(Contact2DType.BEGIN_CONTACT, () => {
                    let grivity = PhysicsSystem2D.instance.gravity;
                    if (Math.sign(grivity.y) > 0 && collider.tag == 1) {
                        return;
                    } else if (Math.sign(grivity.y) < 0 && collider.tag == 2) {
                        return;
                    }
                    this.can_jump = true;
                }, this);
            }
        }
    }

    update() {
        let speed = 8;
        let jump_speed = 16;

        let rb = this.getComponent(RigidBody2D);
        let lv = rb!.linearVelocity;

        let grivity = PhysicsSystem2D.instance.gravity;

        if (Input.is_action_pressed(macro.KEY.a)) {
            lv.x = -speed;
        } else if (Input.is_action_pressed(macro.KEY.d)) {
            lv.x = speed;
        } else {
            lv = new Vec2(0, lv.y);
        }

        if (Input.is_action_just_pressed(macro.KEY.w) && this.can_jump) {
            lv.y = jump_speed * -Math.sign(grivity.y);
            this.can_jump = false;
        }

        if (Input.is_action_just_pressed(macro.KEY.space)) {

            PhysicsSystem2D.instance.gravity = new Vec2(grivity.x, -grivity.y);
        }

        rb!.linearVelocity = lv;
    }
}