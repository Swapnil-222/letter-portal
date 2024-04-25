import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '@core/authentication/auth.service';
/**
 * @whatItDoes Conditionally remove an HTML element if current user has any
 * of the authorities passed as the `expression`.
 *
 * @howToUse
 * ```
 *     <some-element *authorityShow="'ROLE_ADMIN'">...</some-element>
 *
 *     <some-element *authorityShow="['ROLE_ADMIN', 'ROLE_USER']">...</some-element>
 * ```
 */
@Directive({
  selector: '[authorityShow]',
})
export class AuthorityShowDirective {
  private authorities: string[];

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef,
    private auth: AuthService
  ) {}

  @Input()
  set authorityShow(value: string | string[]) {
    this.authorities = typeof value === 'string' ? [value] : value;
    this.updateView();
  }

  private updateView(): void {
    if (!this.auth.hasAnyAuthority(this.authorities)) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
  }
}
