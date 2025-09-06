``
```mermaid
stateDiagram-v2
    [*] --> Idle: entry / VM sets hover=Off, active=Inactive

    Idle --> Hover: hover==On && active==Inactive
    Hover --> Idle: hover==Off && active==Inactive

    Hover --> Active: click && hover==On && active==Inactive / VM sets active=Active
    Active --> Hover: active==Inactive && hover==On
    Active --> Idle: active==Inactive && hover==Off

    %% Optional visual variant if you split Active into two looks:
    %% state Active {
    %%   [*] --> ActiveIdle
    %%   ActiveIdle --> ActiveHover: hover==On
    %%   ActiveHover --> ActiveIdle: hover==Off
    %% }